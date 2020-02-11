var request 		= require('request');
var express 		= require("express");

//var manageAnnulment			= require("./manageAnnulment");
//var manageInvoice			= require("./manageInvoice");
//var queryInvoiceCheck		= require("./queryInvoiceCheck");
//var queryInvoiceData		= require("./queryInvoiceData");
//var queryInvoiceDigest		= require("./queryInvoiceDigest");
//var queryTransactionStatus	= require("./queryTransactionStatus");
var queryTaxpayer			= require("./queryTaxpayer");
//var tokenExchange			= require("./tokenExchange");

var requestType = 'queryTaxpayer'; /*parameter*/
var requestId 	= 'IBDEV0000'; /*szekvencia alapjan generaljuk*/
var user = {
	login: 'aar1zbooepaxmwu',/*parameter*/
	password: 'Kota1706',
	xmlsign: '52-8227-88b7adf566682KAPEQ0GTENJ',
	xmlexchange: '78112KAPEQ0H1XDY',
	taxNumber: '10683424'
};
var requestData = {taxNumber: '12964493'};/*parameter*/

var reqbody;

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
	console.log(body);
});