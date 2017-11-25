$(document).ready(function(){
	var watson = require('watson-developer-cloud');
	var fs = require('fs');

	var visual_recognition = watson.visual_recognition({
	  api_key: 'cf3c8c6033405d046c5c8aa662941549d97ec171',
	  version: 'v3',
	  version_date: '2016-05-20'
	});

	var params = {
	  images_file: fs.createReadStream('../img/fruitbowl.jpg')
	};

	visual_recognition.classify(params, function(err, res) {
	  if (err)
	    console.log(err);
	  else
	    console.log(JSON.stringify(res, null, 2));
	});
});