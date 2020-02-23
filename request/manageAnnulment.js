var BasicRequestType 	= require("./BasicRequestType");
var AnnulmentData 		= require("./AnnulmentData");
var sha3_512 			= require('js-sha3').sha3_512;

function buildManageAnnulment(requestId, user, data, token) {

    var annulmentDataInBase64 	= AnnulmentData.buildAnnulmentData(data);
	var indexhash 				= sha3_512('ANNUL' + annulmentDataInBase64).toUpperCase();
    
    var reqbody = '';
    reqbody = reqbody + '<?xml version="1.0" encoding="UTF-8"?>';
    reqbody = reqbody + '<ManageAnnulmentRequest xmlns="http://schemas.nav.gov.hu/OSA/2.0/api">';
    reqbody = reqbody + BasicRequestType.buildBasicRequestType(requestId, user, true, indexhash);
	reqbody = reqbody + '<exchangeToken>' + token + '</exchangeToken>';
    reqbody = reqbody + '<annulmentOperations>';
	reqbody = reqbody + '<annulmentOperation>';
	reqbody = reqbody + '<index>1</index>';
	reqbody = reqbody + '<annulmentOperation>ANNUL</annulmentOperation>';
	reqbody = reqbody + '<invoiceAnnulment>' + annulmentDataInBase64 + '</invoiceAnnulment>';
	reqbody = reqbody + '</annulmentOperation>';
    reqbody = reqbody + '</annulmentOperations>';
    reqbody = reqbody + '</ManageAnnulmentRequest>';

    return reqbody;
}

module.exports.buildManageAnnulment = buildManageAnnulment;