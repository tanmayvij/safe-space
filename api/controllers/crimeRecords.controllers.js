var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

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
	var maxDist = 5000;
	if(req.query.maxDist)
	{
		maxDist = (parseInt(req.query.maxDist, 10)*1000);
	}
	Hotel
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
					"error": "No hotels not found"
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

module.exports.hotelsGetAll = function(req, res) {
	
		
	var offset = 0;
	var count = 5;
	var maxCount = 1000;
	
	if(req.query && req.query.lat && req.query.lng)
	{
		runGeoQuery(req, res);
		return;
	}
	
	if(req.query && req.query.offset)
	{
		offset = parseInt(req.query.offset, 10);
	}
	if(req.query && req.query.count)
	{
		count = parseInt(req.query.count, 10);
	}
	
	if(isNaN(offset) || isNaN(count)) {
		res.status(400).json({"error" : "Error 400: count and offset should have integer values."});
		return;
	}
	
	if(count > maxCount)
	{
		console.log("Count limit of " + maxCount + " exceeded");
		res.status(400).json({"error" : "Error 400: Count limit of " + maxCount + " exceeded"});
		return;
	}
	
	Hotel
		.find()
	.skip(offset)
	.limit(count)
		.exec(function(err, data) {
			if(err)	{
				console.log("Error finding hotels");
				res.status(500).json(err);
			}
			else {
				console.log("GET", count, "Hotels' data");
				res.status(200)
				.json(data);
			}
		});
	
};

module.exports.hotelsGetOne = function(req, res) {
	
	var hotelId = req.params.hotelId;
	
	Hotel.findById(hotelId, function(err, data) {
		if(err)	{
				console.log("Error finding hotels");
				res.status(500).json(err);
		}
		else {
			if(!data)
			{
				res.status(404).json({
					"error": "Hotel not found"
				});
			}
			else {
				console.log("GET hotelId", hotelId);
				res.status(200)
				.json(data);
			}
		}
	});
};

var _splitArray = function(input) {
  var output;
  if (input && input.length > 0) {
    output = input.split(";");
  } else {
    output = [];
  }
  return output;
};


module.exports.hotelsAddOne = function(req, res) {
	var newHotel, statusCode, returnData;
	
	console.log("POST New Hotel");
	
	newHotel = {
		name : req.body.name,
		description : req.body.description,
		stars : parseInt(req.body.stars, 10),
		services : _splitArray(req.body.services),
		photos : _splitArray(req.body.photos),
		currency : req.body.currency,
		location : {
				address: req.body.address,
				coordinates : [
					parseFloat(req.body.lng),
					parseFloat(req.body.lat)
				]
		}
      };
	
	Hotel
	.create(newHotel,
		function(err, result){
			if(err) {
				console.log('Oops');
				statusCode = 400;
				returnData = err;
			}
			else {
				statusCode = 201;
				returnData = result;
			}
			res.status(statusCode).json(returnData);		
		}
	);
	
};

module.exports.hotelsUpdate = function(req, res) {
	var hotelId = req.params.hotelId;
	
	Hotel
	.findById(hotelId)
	.select("-reviews -rooms")
	.exec(function(err, data) {
		if(err)	{
				console.log("Error querying the hotels");
				res.status(500).json(err);
		}
		else {
			if(!data)
			{
				res.status(404).json({
					"error": "Hotel not found"
				});
			}
			else {
				console.log("UPDATE hotelId", hotelId);
				data.name = req.body.name;
				data.description = req.body.description;
				data.stars = parseInt(req.body.stars, 10);
				data.services = _splitArray(req.body.services);
				data.photos = _splitArray(req.body.photos);
				data.currency = req.body.currency;
				data.location = {
						address: req.body.address,
						coordinates : [
							parseFloat(req.body.lng),
							parseFloat(req.body.lat)
						]
				};
				
				data.save(function(err, result){
					if(err)
					{
						res.status(500).json(err);
					}
					else {
						res.status(204).json();
					}
				});
			}
		}
	});
};
module.exports.hotelsDelete = function(req, res) {
	var hotelId = req.params.hotelId;
	
	Hotel
	.findByIdAndRemove(hotelId)
	.exec(function(err, data) {
		if(err)	{
				res.status(500).json(err);
		}
		else if(!data)
		{
			res.status(404).json({
				"error": "Hotel not found"
			});
		}
		else {
			console.log("DELETE hotelId", hotelId, "Successful");
			res.status(204).json();
		}
	});
};