var BasicRequestType = require("./BasicRequestType");

function buildQueryTaxpayer(requestId, user, data){
	
	var reqbody = '';
	reqbody = reqbody + '<?xml version="1.0" encoding="UTF-8"?>';
	reqbody = reqbody + '<QueryTaxpayerRequest xmlns="http://schemas.nav.gov.hu/OSA/2.0/api">';
	reqbody = reqbody + BasicRequestType.buildBasicRequestType(requestId, user, false, null);
	reqbody = reqbody + '<taxNumber>' + data.taxNumber + '</taxNumber>';
	reqbody = reqbody + '</QueryTaxpayerRequest>';

	return reqbody;
}

module.exports.buildQueryTaxpayer = buildQueryTaxpayer;