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
							$("#photos ul").append("<li><div class='overlay'></div><div class='likes'>"+image.likes.count+" <i class='fa fa-heart' aria-hidden='true'></i></div><img id='img"+compteur+"' src='"+src+"'></li>");
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
	})

});