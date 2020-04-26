var BasicRequestType 	= require("./BasicRequestType");
var InvoiceData 		= require("./InvoiceDataSimplifiedCreate");
var sha3_512 			= require('js-sha3').sha3_512;

function buildManageInvoice(requestId, user, data, token) {

    var invoiceDataInBase64;
	
	/*Currentry only CREATE transaction is supported for SIMPLIFIED invoices. This is where to create branches when support becomes available for other types of data transactions*/
	if(data.invoiceCategory == 'SIMPLIFIED'){
		if(data.invoiceOperation == 'CREATE'){
			invoiceDataInBase64 = InvoiceDataSimplifiedCreate.buildInvoiceData(data);
		}
	}
	
	var indexhash = sha3_512(data.invoiceOperation + invoiceDataInBase64).toUpperCase();
    
    var reqbody = '';
    reqbody = reqbody + '<?xml version="1.0" encoding="UTF-8"?>';
    reqbody = reqbody + '<ManageInvoiceRequest xmlns="http://schemas.nav.gov.hu/OSA/2.0/api">';
    reqbody = reqbody + BasicRequestType.buildBasicRequestType(requestId, user, true, indexhash);
	reqbody = reqbody + '<exchangeToken>' + token + '</exchangeToken>';
    reqbody = reqbody + '<invoiceOperations>';
    reqbody = reqbody + '<compressedContent>false</compressedContent>';
	reqbody = reqbody + '<invoiceOperation>';
	reqbody = reqbody + '<index>1</index>';
	reqbody = reqbody + '<invoiceOperation>' + data.invoiceOperation + '</invoiceOperation>';
	reqbody = reqbody + '<invoiceData>' + invoiceDataInBase64 + '</invoiceData>';
	reqbody = reqbody + '</invoiceOperation>';
    reqbody = reqbody + '</invoiceOperations>';
    reqbody = reqbody + '</ManageInvoiceRequest>';

    return reqbody;
}

module.exports.buildManageInvoice = buildManageInvoice;