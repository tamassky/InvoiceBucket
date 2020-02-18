var request 		= require('request');
var express 		= require('express');
var convert 		= require('xml-js');
var aes				= require('aes-ecb');

//var manageAnnulment			= require("./manageAnnulment");
var manageInvoice			= require("./manageInvoice");
//var queryInvoiceCheck		= require("./queryInvoiceCheck");
//var queryInvoiceData		= require("./queryInvoiceData");
//var queryTransactionStatus	= require("./queryTransactionStatus");
var queryTaxpayer			= require("./queryTaxpayer");
var tokenExchange			= require("./tokenExchange");

var user = {/*parameter*/
	login: 'aar1zbooepaxmwu',
	password: 'Kota1706',
	xmlsign: '52-8227-88b7adf566682KAPEQ0GTENJ',
	xmlexchange: '78112KAPEQ0H1XDY',
	taxNumber: '10683424'
};

var requestData = {taxNumber: '13337940'};/*queryTaxpayer*/

var replyToClient = setRequest('tokenExchange', user, null);
new Promise((resolve, reject) => { 
	if (replyToClient)
		resolve(replyToClient);
})
.then(replyToClient => console.log(replyToClient));

async function setRequest(requestType, user, requestData){
	
	
	var date_now	= new Date();
	var requestId 	= 'IB' + user.login.substring(1, 10) + date_now.mask();

	var reqbody;
	var processedResponse;
	var token;

	switch(requestType){
		case 'manageAnnulment':
			break;
		case 'manageInvoice':
			var tokenReply = setRequest('tokenExchange', user, null);
			new Promise((resolve, reject) => { 
				if (tokenReply)
					resolve(tokenReply);
			})
			.then(tokenReply => token = tokenReply);
			reqbody = manageInvoice.buildManageInvoice(requestId, user, requestData, token);
			break;
		case 'queryInvoiceCheck':
			break;
		case 'queryInvoiceData':
			break;
		case 'queryTransactionStatus':
			break;
		case 'queryTaxpayer':
			reqbody = queryTaxpayer.buildQueryTaxpayer(requestId, user, requestData);
			break;
		case 'tokenExchange':
			reqbody = tokenExchange.buildTokenExchange(requestId, user);
			break;
	}

	console.log(reqbody);
	
	const res = await sendRequest(requestType, user, reqbody).catch(err => console.log(err));
	if (res == 'error')
		processedResponse = 'request_error';
	else
		processedResponse = processResponse(requestType, res, user);
	return processedResponse;
}

function sendRequest(requestType, user, reqbody){
	return new Promise((resolve, reject) => {
		var resp;
		request.post({
			headers: { 	'content-type'	: 'application/xml',
						'accept'		: 'application/xml'},
			url: process.env.APIURL + requestType,
			body: reqbody
		}, function(error, response, body){
			if (error) 
				reject(error);
        	resp = convert.xml2js(body, { compact: true });
			console.log(response.statusCode);/**/
			console.log(resp); /**/
			if(response.statusCode != 200)
				resolve('error');
			else
				resolve(resp);
		});
	});
}

function processResponse(requestType, rawResponse, user){	
	switch(requestType){
		case 'manageAnnulment':
			break;
		case 'manageInvoice':
			break;
		case 'queryInvoiceCheck':
			break;
		case 'queryInvoiceData':
			break;
		case 'queryTransactionStatus':
			break;
		case 'queryTaxpayer':
			var taxpayer = {
				validity: rawResponse.QueryTaxpayerResponse.taxpayerValidity,
				data: rawResponse.QueryTaxpayerResponse.taxpayerData
			};
			return taxpayer;
			break;
		case 'tokenExchange':
			var tokenEncoded = rawResponse.TokenExchangeResponse.encodedExchangeToken._text;
			var tokenDecoded = aes.decrypt(user.xmlexchange, tokenEncoded);
			return tokenDecoded;
			break;
	}
}

module.exports.setRequest = setRequest;