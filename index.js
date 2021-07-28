const fetch = require("node-fetch");
const express = require('express')
const PORT = process.env.PORT || 5000

express()
	.get('/', async (request, response) => sendPOST(request, response))
	.listen(PORT, () => console.log(`Listening on ${ PORT }`))
  
sendPOST =  async(request, response) => {
	const auth_name_ = request.query.auth_name;
	const auth_key_ = request.query.auth_key;
	
	const sendername_ = request.query.sendername;
	var userID_ = request.query.userID;
	var username_ = request.query.username;
	var text_ = request.query.text;
	var schedule_ = request.query.schedule;
	var private_ = request.query.private;
	
	if(userID_ === 'NO_USERID') userID_ = undefined;
	if(username_ === 'NO_USERNAME') username_ = undefined;
	if(text_ === 'NO_TEXT') text_ = undefined;
	if(schedule_ === 'NO_SCHEDULE') schedule_ = undefined;
	if(private_ === 'NO_PRIVATE') private_ = 0;

	if(userID_ === undefined && username_ === undefined && text_ === undefined && schedule_ === undefined) {
		const errorJson = { statusCode: 400,  error: { message:'Usage: url/?auth_name=REPLACE&auth_key=REPLACE&userID=REPLACE&username=REPLACE&text=REPLACE&schedule=REPLACE&private=REPLACE' } }
		console.log(errorJson);
		response.status(400).json(errorJson);
		response.send();
		return;
	}

	if(auth_name_ === undefined || auth_key_ === undefined) {
		const errorJson = { statusCode: 401,  error: { message:'Authorization Failed.' } }
		console.log(errorJson);
		response.status(401).json(errorJson);
		response.send();
		return;
	}
	if(userID_ !== undefined && username_ !== undefined) {
		const errorJson = { statusCode: 400,   error: { message:'Invalid Request. Both ID and name were used at the same time.' } };
		console.log(errorJson);
		response.status(400).json();
		response.send();
		return;
	}
	if(userID_ === undefined && username_ === undefined) {
		const errorJson = { statusCode: 400,   error: { message:'Invalid Request. No user provided.' } };
		console.log(errorJson);
		response.status(400).json();
		response.send();
		return;
	}
	
	if(username_ === 'me') username_ = sendername_;
	
	var requestUrl = 'https://supinic.com/api/bot/reminder/?'
	if(userID_ !== undefined) requestUrl += 'userID=' + userID_;
	if(username_ !== undefined) requestUrl += 'username=' + username_;
	if(text_ !== undefined) requestUrl += '&text=' + text_;
	if(schedule_ !== undefined) requestUrl += '&schedule=' + schedule_;
	if(private_ !== undefined) requestUrl += '&private=' + private_;
	
	var responseData;
	
	try {
		await fetch(requestUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'User-Agent':'https://github.com/GreenComfyTea/Supibot-Reminder-GET-API This API is a wrapper for Supibot reminder create API. Supibot API wants POST request but I cant do that with Fossabot, so I made this API that sends POST request after user sends GET request.',
				'Authorization': 'Basic ' + auth_name_ + ':' + auth_key_
			}
		})
		.then(supibotResponse  => supibotResponse.json())
		.then(function (data) {
			responseData = data;
		});
		
		console.log(responseData);
		response.status(responseData.statusCode).json(responseData);
		response.send();
	}
	catch (error) {
		response.status(500).json({ error:  { message:error } });
		console.log(error)
	  }
}