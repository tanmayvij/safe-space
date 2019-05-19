var express = require('express');
var router = express.Router();
var threats = require('../controllers/threats.controllers.js');
//var events = require('../controllers/events.controllers.js');
//var crimeRecords = require('../controllers/crimeRecords.controllers.js');

router.route('/threats')
	.get(threats.getAll);
	/*
router.route('/events/:eventId')
	.get(events.getOne);

router.route('/crimeRecords/:visitorId')
	.get(crimeRecords.getOne);
	
*/
module.exports = router;
