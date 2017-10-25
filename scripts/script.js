$(document).ready(function(){

	$("#search_form").submit(function(e){
		e.preventDefault();
		var name = $('#username').val();
		console.log(name);
		if (name){
			$.ajax({
				url: "https://www.instagram.com/"+name+"/media/",
				dataType: "json",
				success: function(data){
					if (data.items.length > 0){
						$("#photos ul").html("");
						$('#no_result').hide();
						var compteur = 0;
						data.items.forEach(function(image){
							console.log(image);
							var img = image.images.standard_resolution;
							var src = img.url;
							var width = img.width;
							var height = img.height;
							var location ="";
							if (image.location) {
								location = "<div class='location' title='"+image.location.name+"'><p><i class='fa fa-map-marker' aria-hidden='true'></i> "+image.location.name+"</p></div>"
							}
							$("#photos ul").append("<li><div class='external_link'><a href='"+image.link+"' target='_blank'><i class='fa fa-external-link-square' aria-hidden='true'></i></a></div><div class='overlay'></div><div class='likes'>"+formatNb(image.likes.count)+" <i class='fa fa-heart' aria-hidden='true'></i></div>"+location+"<img id='img"+compteur+"' src='"+src+"'></li>");
							$('#img'+compteur).parent().height($('#img'+compteur).parent().width());
							if (width<height){
								$('#img'+compteur).css({
									height: "auto",
									width: "100%"
								});
							}
							compteur++;
						});
					} else {
						$("#photos ul").html("");
						$('#no_result').show();
					}
				},
				error: function(){
					console.log("Ce nom d'utilisateur n'existe pas");
					$("#photos ul").html("");	
					$('#no_result').show();
				}
			})
		}
	});

	$(window).resize(function(){
		$("#photos ul li").height($("#photos ul li").width());
	});

});

var formatNb = function(nb){
	var res = nb.toString();
	if (res.toString().length>3) {
		var position = 0;
		if (res.toString().length==4) {
			position = 1;
		} else if (res.toString().length==5) {
			position = 2;
		} else if (res.toString().length==6) {
			position = 3;
		} else if (res.toString().length==7) {
			position = 4;
			res =  [res.slice(0, 1), " ", res.slice(1, position), " ", res.slice(position)].join('');
		}
		if (position<4){
			res =  [res.slice(0, position), " ", res.slice(position)].join('');
		}
	}
	return res;
}