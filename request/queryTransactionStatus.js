var BasicRequestType = require("./BasicRequestType");

function buildQueryTransactionStatus(requestId, user, requestData){
	
	var reqbody = '';
	reqbody = reqbody + '<?xml version="1.0" encoding="UTF-8"?>';
	reqbody = reqbody + '<QueryTransactionStatusRequest xmlns="http://schemas.nav.gov.hu/OSA/2.0/api">';
	reqbody = reqbody + BasicRequestType.buildBasicRequestType(requestId, user, false, null);
	reqbody = reqbody + '<transactionId>' + requestData.transactionId + '</transactionId>';
	reqbody = reqbody + '<returnOriginalRequest>false</returnOriginalRequest>';
	reqbody = reqbody + '</QueryTransactionStatusRequest>';

	return reqbody;
}

module.exports.buildQueryTransactionStatus = buildQueryTransactionStatus;