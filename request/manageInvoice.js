var BasicRequestType = require("./BasicRequestType");

function buildManageInvoice(requestId, user, data){
	
	var reqbody = '';
	reqbody = reqbody + '<?xml version="1.0" encoding="UTF-8"?>';
	reqbody = reqbody + '<ManageInvoiceRequest xmlns="http://schemas.nav.gov.hu/OSA/2.0/api">';
	reqbody = reqbody + BasicRequestType.buildBasicRequestType(requestId, user, true);
	reqbody = reqbody + '<invoiceOperations>'
	reqbody = reqbody + '<compressedContent>false</compressedContent>'
	reqbody = reqbody + '</invoiceOperations>';
	reqbody = reqbody + '</ManageInvoiceRequest>';

	return reqbody;
}

module.exports.buildManageInvoice = buildManageInvoice;