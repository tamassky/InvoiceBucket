var sha512 		= require('js-sha512').sha512;
var sha3_512 	= require('js-sha3').sha3_512;

function zero(number, length){
	var str = '' + number;
	while(str.length < length){
		str = '0' + str;
	}
	return str;
}

Date.prototype.mask = function mask () {
	var year 	= this.getFullYear().toString();
	var month	= zero(this.getMonth() + 1, 2);
	var day		= zero(this.getDate(), 2);
	var hour	= zero(this.getHours(), 2);
	var minute	= zero(this.getMinutes(), 2);
	var second	= zero(this.getSeconds(), 2);
	return year + month + day + hour + minute + second;
}

function buildBasicRequestType(requestId, user, indexHashExists, indexHash){
	
	var hashPassword 		= user.password.toUpperCase();
	var date_now			= new Date();
	var utctime 			= date_now.toISOString();
	var partial				= requestId + date_now.mask() + user.xmlsign;

	if(indexHashExists)
		var requestSignature = sha3_512(partial + indexHash).toUpperCase();
	else
		var requestSignature = sha3_512(partial).toUpperCase();
	
	var reqbody = '';	
	reqbody = reqbody + '<header>';
	reqbody = reqbody + '<requestId>' + requestId + '</requestId>';
	reqbody = reqbody + '<timestamp>' + utctime + '</timestamp>';
	reqbody = reqbody + '<requestVersion>2.0</requestVersion>';
	reqbody = reqbody + '<headerVersion>1.0</headerVersion>';
	reqbody = reqbody + '</header>';
	reqbody = reqbody + '<user>';
	reqbody = reqbody + '<login>' + user.login + '</login>';
	reqbody = reqbody + '<passwordHash>' + hashPassword + '</passwordHash>';
	reqbody = reqbody + '<taxNumber>' + user.taxNumber + '</taxNumber>';
	reqbody = reqbody + '<requestSignature>' + requestSignature + '</requestSignature>';
	reqbody = reqbody + '</user>';
	reqbody = reqbody + '<software>';
	reqbody = reqbody + '<softwareId>INVOICEBUCKET2020A</softwareId>';
	reqbody = reqbody + '<softwareName>Invoice Bucket</softwareName>';
	reqbody = reqbody + '<softwareOperation>ONLINE_SERVICE</softwareOperation>';
	reqbody = reqbody + '<softwareMainVersion>0.1</softwareMainVersion>';
	reqbody = reqbody + '<softwareDevName>Kovacs Tamas</softwareDevName>';
	reqbody = reqbody + '<softwareDevContact>openbvehu@gmail.com</softwareDevContact>';
	reqbody = reqbody + '<softwareDevCountryCode>HU</softwareDevCountryCode>';
	reqbody = reqbody + '</software>';
	
	return reqbody;
}

module.exports.buildBasicRequestType = buildBasicRequestType;