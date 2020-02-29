var BasicRequestType = require("./BasicRequestType");

function buildQueryInvoiceData(requestId, user, requestData){
	
	var reqbody = '';
	reqbody = reqbody + '<?xml version="1.0" encoding="UTF-8"?>';
	reqbody = reqbody + '<QueryInvoiceDataRequest xmlns="http://schemas.nav.gov.hu/OSA/2.0/api">';
	reqbody = reqbody + BasicRequestType.buildBasicRequestType(requestId, user, false, null);
	reqbody = reqbody + '<invoiceNumberQuery>';
	reqbody = reqbody + '<invoiceNumber>' + requestData.invoiceNumber + '</invoiceNumber>';
	reqbody = reqbody + '<invoiceDirection>' + requestData.invoiceDirection + '</invoiceDirection>';
	if(requestData.batchIndex)	
		reqbody = reqbody + '<batchIndex>' + requestData.batchIndex + '</batchIndex>';
	if(requestData.invoiceDirection == 'INBOUND')
		reqbody = reqbody + '<supplierTaxNumber>' + requestData.supplierTaxNumber + '</supplierTaxNumber>';
	reqbody = reqbody + '</invoiceNumberQuery>';
	reqbody = reqbody + '</QueryInvoiceDataRequest>';

	return reqbody;
}

module.exports.buildQueryInvoiceData = buildQueryInvoiceData;