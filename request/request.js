var request 		= require('request');
var express 		= require('express');
var convert 		= require('xml-js');
var aes				= require('aes-ecb');
var util 			= require('util');

var manageAnnulment			= require("./manageAnnulment");
var manageInvoice			= require("./manageInvoice");
var queryInvoiceCheck		= require("./queryInvoiceCheck");
var queryInvoiceData		= require("./queryInvoiceData");
var queryTransactionStatus	= require("./queryTransactionStatus");
var queryTaxpayer			= require("./queryTaxpayer");
var tokenExchange			= require("./tokenExchange");



async function setRequest(requestType, user, requestData){
	
	var date_now	= new Date();
	var requestId 	= 'IB' + user.login.substring(1, 10) + date_now.mask();
	if(requestType == 'tokenExchange')
		requestId = requestId + 't';
	if(requestType == 'queryTransactionStatus')
		requestId = requestId + requestData.index;
	var reqbody;
	var processedResponse;
	var token;

	switch(requestType){
		case 'manageAnnulment':
			token = await setRequest('tokenExchange', user, null);
			reqbody = await manageAnnulment.buildManageAnnulment(requestId, user, requestData, token);
			break;
		case 'manageInvoice':
			token = await setRequest('tokenExchange', user, null);
			reqbody = await manageInvoice.buildManageInvoice(requestId, user, requestData, token);
			break;
		case 'queryInvoiceCheck':
			reqbody = queryInvoiceCheck.buildQueryInvoiceCheck(requestId, user, requestData);
			break;
		case 'queryInvoiceData':
			reqbody = queryInvoiceData.buildQueryInvoiceData(requestId, user, requestData);
			break;
		case 'queryTransactionStatus':
			reqbody = queryTransactionStatus.buildQueryTransactionStatus(requestId, user, requestData);
			break;
		case 'queryTaxpayer':
			reqbody = queryTaxpayer.buildQueryTaxpayer(requestId, user, requestData);
			break;
		case 'tokenExchange':
			reqbody = tokenExchange.buildTokenExchange(requestId, user);
			break;
	}

	/*console.log(reqbody);*/
	const res = await sendRequest(requestType, user, reqbody).catch(err => console.log(err));
	if (res == 'error')
		processedResponse = 'request_error';
	else{
		if (res == 'server_error')
			processedResponse = 'server_error';
		else
			processedResponse = processResponse(requestType, res, user);
	}
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
			if(error)
				return resolve('server_error');
			if(!response)
				return resolve('server_error');
			/*console.log(response.statusCode);*/
			/*console.log(body);*/
        	resp = convert.xml2js(body, { compact: true });
			/*console.log(util.inspect(resp, {showHidden: false, depth: null})); */
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
			return rawResponse.ManageAnnulmentResponse.transactionId._text;
			break;
		case 'manageInvoice':
			return rawResponse.ManageInvoiceResponse.transactionId._text;
			break;
		case 'queryInvoiceCheck':
			return rawResponse.QueryInvoiceCheckResponse.invoiceCheckResult._text;
			break;
		case 'queryInvoiceData':
			return rawResponse.QueryInvoiceDataResponse.invoiceDataResult;
			break;
		case 'queryTransactionStatus':
			return rawResponse.QueryTransactionStatusResponse.processingResults.processingResult;
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
			var tokenDecoded = aes.decrypt(user.xmlexchange, tokenEncoded)
			while(tokenDecoded.charCodeAt(tokenDecoded.length - 1) < 32)
				tokenDecoded = tokenDecoded.slice(0, -1);
			return tokenDecoded;
			break;
	}
}

module.exports.setRequest = setRequest;