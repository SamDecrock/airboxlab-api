#!/usr/bin/env node

var httpreq = require('httpreq');
var _ = require('underscore');


function getValues () {
	console.log("getting values");
	httpreq.get('https://api.airboxlab.com/v1/data/', {
		parameters:{
			'attr[airboxId]' : 'YOUR_AIRBOXLAB_ID',
			start            : '2014-04-19T14:30:00.000Z',
			end              : '2014-04-21',
			interval         : '1min',
			tz               : 'Europe/Brussels'
		},
		headers: {
			Authorization      : 'Basic ENTER_BASE64_USERNAME_AND_PASSWORD_HERE',
			'X-Requested-With' : 'XMLHttpRequest',
			'User-Agent'       : 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D167 (366463920)'
		}
	}, function (err, res) {
		if(err) return console.log(err);

		var data = JSON.parse(res.body);

		// console.log(data);

		var voc = _.find(data, function (el) {
			return el.series.key.match(/voc.series/);
		});

		var voc100 = _.find(data, function (el) {
			return el.series.key.match(/voc100.series/);
		});

		parseLastEntry("VOC", voc, voc100);
	});

}

function parseLastEntry (type, series, series100) {
	var lastEntry = series.data[series.data.length-1];
	var date = new Date(lastEntry.t);


	var lastEntry100 = series100.data[series100.data.length-1];
	var date100 = new Date(lastEntry100.t);

	if(date.getTime() == date100.getTime())
		console.log("[" + date +"] " + type + " value: " + lastEntry.v + "("+ lastEntry100.v +"%)");
	else
		console.log("[" + date +"] " + type + " value: " + lastEntry.v + "("+ lastEntry100.v +"% at "+date100+")");



	// get next value in 5 minutes:
	var nextValueTime = date.getTime() + 5*60*1000;
	var delay = nextValueTime - Date.now();

	var delay = delay + 10*1000; // add 10 seconds, just to be sure
	setTimeout(getValues, delay);
}


getValues();







