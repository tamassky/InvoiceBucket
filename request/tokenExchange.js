var BasicRequestType = require("./BasicRequestType");

function buildTokenExchange(requestId, user){
	
	var reqbody = '';
	reqbody = reqbody + '<?xml version="1.0" encoding="UTF-8"?>';
	reqbody = reqbody + '<TokenExchangeRequest xmlns="http://schemas.nav.gov.hu/OSA/2.0/api">';
	reqbody = reqbody + BasicRequestType.buildBasicRequestType(requestId, user, false, null);
	reqbody = reqbody + '</TokenExchangeRequest>';

	return reqbody;
}

module.exports.buildTokenExchange = buildTokenExchange;