var Base64 = require('js-base64').Base64;

function buildAnnulmentData(data){
	
    var annulmentdata = '';
	annulmentdata = annulmentdata + '<?xml version="1.0" encoding="UTF-8"?>';
	annulmentdata = annulmentdata + '<InvoiceAnnulment xmlns="http://schemas.nav.gov.hu/OSA/2.0/annul" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://schemas.nav.gov.hu/OSA/2.0/annul invoiceAnnulment.xsd">';
	annulmentdata = annulmentdata + '<annulmentReference>' + data.annulmentReference + '</annulmentReference>';
	annulmentdata = annulmentdata + '<annulmentTimestamp>' + data.annulmentTimestamp + '</annulmentTimestamp>';
	annulmentdata = annulmentdata + '<annulmentCode>' + data.annulmentCode + '</annulmentCode>';
	annulmentdata = annulmentdata + '<annulmentReason>' + data.annulmentReason + '</annulmentReason>';
	annulmentdata = annulmentdata + '</InvoiceAnnulment>';
	
	console.log(annulmentdata);/**/
	return Base64.encode(annulmentdata);	
}

module.exports.buildAnnulmentData = buildAnnulmentData;