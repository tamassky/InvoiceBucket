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

var requestData = { /*manageInvoice-create-normal*/
	invoiceOperation: 'CREATE',
	invoiceNumber: '2020/300012',
	invoiceIssueDate: '2020-05-15',
	originalInvoiceNumber: null,
	modificationIndex: null,
	invoiceCategory: 'NORMAL',
	invoiceDeliveryDate: '2020-05-10',
	paymentMethod: 'TRANSFER',
	paymentDate: '2020-05-30',
	cashAccountingIndicator: false,
	invoiceAppearance: 'PAPER',
	supplierTaxpayerId: '10683424',
	supplierVatCode: '2',
	supplierCountyCode: '09',
	supplierName: 'DANIELLA KERESKEDELMI KORLÁTOLT FELELŐSSÉGŰ TÁRSASÁG',
	supplierPostalCode: '4031',
	supplierCity: 'DEBRECEN',
	supplierAdditionalAddressDetail: 'KÖNTÖSGÁT SOR 1-3',
	supplierBankAccountNumber: '88888888-66666666-12345678',
	individualExemption: false,
	customerTaxpayerId: '13337940',
	customerVatCode: '2',
	customerCountyCode: '09',
	customerName: 'DANIELLA IPARI PARK SZOLGÁLTATÓ KORLÁTOLT FELELŐSSÉGŰ TÁRSASÁG',
	customerPostalCode: '4031',
	customerCity: 'DEBRECEN',
	customerAdditionalAddressDetail: 'KÖNTÖSGÁT SOR 1-3',
	customerBankAccountNumber: '88888888-66666666-12345679',
	lines:[
		{
			lineNumber: 1,
			lineNumberReference: null,
			lineOperation: null,
			productCodeCategory: 'VTSZ',
			productCodeValue: '02031110',
			lineNatureIndicator: 'PRODUCT',
			lineDescription: 'Hűtött házi sertés',
			quantity: '1500',
			unitOfMeasure: 'KILOGRAM',
			unitOfMeasureOwn: null,
			unitPrice: '400',
			intermediatedService: false,
			lineNetAmount: '600000',
			vatPercentage: '5',
			lineVatAmount: '30000',
			lineVatContentSimplified: null,
			lineGrossAmountSimplified: null 
		},
		{
			lineNumber: 2,
			lineNumberReference: null,
			lineOperation: null,
			productCodeCategory: 'VTSZ',
			productCodeValue: '16010091',
			lineNatureIndicator: 'PRODUCT',
			lineDescription: 'Érlelt szalámi',
			quantity: '1600',
			unitOfMeasure: 'KILOGRAM',
			unitOfMeasureOwn: null,
			unitPrice: '3000',
			intermediatedService: false,
			lineNetAmount: '4800000',
			vatPercentage: '27',
			lineVatAmount: '1296000',
			lineVatContentSimplified: null,
			lineGrossAmountSimplified: null
		}
	],
	vatRates:[
		{
			vatPercentage: '5',
			vatExemption: null,
			vatOutOfScope: null,
			vatDomesticReverseCharge: null,
			marginSchemeVat: null,
			marginSchemeNoVat: null,
			vatRateNetAmount: '600000',
			vatRateVatAmount: '30000'
		},
		{
			vatPercentage: '27',
			vatExemption: null,
			vatOutOfScope: null,
			vatDomesticReverseCharge: null,
			marginSchemeVat: null,
			marginSchemeNoVat: null,
			vatRateNetAmount: '4800000',
			vatRateVatAmount: '1296000'
		}
	],
	invoiceNetAmount: '5400000‬',
	invoiceVatAmount: '1326000‬',
	vatContent: null,
	vatContentGrossAmount: null,
	invoiceGrossAmount: '6726000' 
};

var replyToClient = setRequest('manageInvoice', user, requestData);
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
			token = await setRequest('tokenExchange', user, null);
			reqbody = await manageInvoice.buildManageInvoice(requestId, user, requestData, token);
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
			console.log(rawResponse);
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