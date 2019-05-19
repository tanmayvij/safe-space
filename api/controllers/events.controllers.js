var mongoose = require('mongoose');

var Hotel = mongoose.model('Hotel');

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
