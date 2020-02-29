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

var user = {/*parameter*/
	login: 'aar1zbooepaxmwu',
	password: '2ed63e96d609e096e840c1e16178c72c2f9dd40f2c070903ddc5d6badc1c22f4f783500b954ca0662773a8957735a02c33ca1b4e317ae8ce00da7b12f2016902',
	xmlsign: '52-8227-88b7adf566682KAPEQ0GTENJ',
	xmlexchange: '78112KAPEQ0H1XDY',
	taxNumber: '10683424'
};

var requestData = { /*QueryInvoiceCheck & QueryInvoiceData OUTBOUND*/
	invoiceNumber: '2020/300013',
	invoiceDirection: 'OUTBOUND',
	batchIndex: null,
	supplierTaxNumber: null
};

var replyToClient = setRequest('queryInvoiceData', user, requestData); 	/**/
new Promise((resolve, reject) => { 										/**/
	if (replyToClient)													/**/
		resolve(replyToClient);											/**/
})																		/**/
.then(replyToClient => console.log(replyToClient));						/**/

async function setRequest(requestType, user, requestData){
	
	var date_now	= new Date();
	var requestId 	= 'IB' + user.login.substring(1, 10) + date_now.mask();
	if(requestType == 'tokenExchange')
		requestId = requestId + 't';

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
			console.log(util.inspect(resp, {showHidden: false, depth: null})); /**/
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
			while(tokenDecoded[tokenDecoded.length - 1] == '\u0010')
				tokenDecoded = tokenDecoded.slice(0, -1);
			return tokenDecoded;
			break;
	}
}

module.exports.setRequest = setRequest;