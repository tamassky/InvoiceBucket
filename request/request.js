var request 		= require('request');
var express 		= require('express');
var convert 		= require('xml-js');
var aes				= require('aes-ecb');

//var manageAnnulment			= require("./manageAnnulment");
var manageInvoice			= require("./manageInvoice");
//var queryInvoiceCheck		= require("./queryInvoiceCheck");
//var queryInvoiceData		= require("./queryInvoiceData");
//var queryInvoiceDigest		= require("./queryInvoiceDigest");
//var queryTransactionStatus	= require("./queryTransactionStatus");
var queryTaxpayer			= require("./queryTaxpayer");
var tokenExchange			= require("./tokenExchange");

var user = {
		login: 'aar1zbooepaxmwu',/*parameter*/
		password: 'Kota1706',
		xmlsign: '52-8227-88b7adf566682KAPEQ0GTENJ',
		xmlexchange: '78112KAPEQ0H1XDY',
		taxNumber: '10683424'
	};

sendRequest('tokenExchange', user);

function sendRequest(requestType, user){
	
	
	var date_now	= new Date();
	var requestId 	= 'IB' + user.login.substring(1, 10) + date_now.mask();
	//var requestData = {taxNumber: '12964493'};/*parameter*/
	//var requestData = {}

	var reqbody;
	var resp;
	var processedResponse;

	switch(requestType){
		case 'manageAnnulment':
			break;
		case 'manageInvoice':
			break;
		case 'queryInvoiceCheck':
			break;
		case 'queryInvoiceData':
			break;
		case 'queryInvoiceDigest':
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

	request.post({
		headers: { 	'content-type'	: 'application/xml',
					'accept'		: 'application/xml'},
		url: process.env.APIURL + requestType,
		body: reqbody
	}, function(error, response, body){
		console.log(error);
		resp = convert.xml2js(body, {compact:true});
		console.log(resp);/**/
		processedResponse = processResponse(requestType, resp, user);
		/*console.log(processedResponse);*/
	});
	
	console.log(processedResponse);
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
		case 'queryInvoiceDigest':
			break;
		case 'queryTransactionStatus':
			break;
		case 'queryTaxpayer':
			break;
		case 'tokenExchange':
			var tokenEncoded = rawResponse.TokenExchangeResponse.encodedExchangeToken._text;
			var tokenDecoded = aes.decrypt(user.xmlexchange, tokenEncoded);
			return tokenDecoded;
			break;
	}
}

module.exports.sendRequest = sendRequest;