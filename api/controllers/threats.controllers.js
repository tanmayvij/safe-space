var mongoose = require('mongoose');
var Threat = mongoose.model('Threat');

var runGeoQuery = function(req, res) {
	
	if (isNaN(req.query.lng) || isNaN(req.query.lat)) {
		res
		.status(400).
		json({"error": "Error 400: lat and lng should have floating point values."});
		return;
	}
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	
	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};
	var maxDist = 1000;
	if(req.query.maxDist)
	{
		maxDist = (parseInt(req.query.maxDist, 10)*1000);
	}
	Threat
		.aggregate([
			{
				$geoNear: {
					near: point,
					spherical: true,
					maxDistance: maxDist,
					num: 5,
					distanceField: "dist.calculated"
				}
			}
		]).then( function(results) {
			if(results.length == 0 || !results)
			{
				res
					.status(404)
					.json({
					"error": "no threats found"
				});
			}
			else {
				console.log('Geo Results', results);
				res
					.status(200)
					.json(results);
			}
		});
};

module.exports.getAll = function(req, res) {
	
		
	
	if(req.query && req.query.lat && req.query.lng)
	{
		runGeoQuery(req, res);
		return;
	}
	
};
