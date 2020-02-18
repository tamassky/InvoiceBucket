var Base64 = require('js-base64').Base64;

function buildInvoiceData(data){
	
    var invoicedata = '';
	
	invoicedata = invoicedata + '<?xml version="1.0" encoding="UTF-8"?>';
	invoicedata = invoicedata + '<InvoiceData xmlns="http://schemas.nav.gov.hu/OSA/2.0/data" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://schemas.nav.gov.hu/OSA/2.0/data invoiceData.xsd">';
	invoicedata = invoicedata + '<invoiceNumber>' + data.invoiceNumber + '</invoiceNumber>';
	invoicedata = invoicedata + '<invoiceIssueDate>' + data.invoiceIssueDate + '</invoiceIssueDate>';
	invoicedata = invoicedata + '<invoiceMain>';
	invoicedata = invoicedata + '<invoice>';
	
	if(invoiceOperation != 'CREATE'){
		invoicedata = invoicedata + '<invoiceReference>';
		invoicedata = invoicedata + '<originalInvoiceNumber>' + data.originalInvoiceNumber +'</originalInvoiceNumber>';
		invoicedata = invoicedata + '<modifyWithoutMaster>false</modifyWithoutMaster>';
		invoicedata = invoicedata + '<modificationIndex>' + data.modificationIndex + '</modificationIndex>';
		invoicedata = invoicedata + '</invoiceReference>';
	}
	
	invoicedata = invoicedata + '<invoiceHead>';
	
	invoicedata = invoicedata + '<supplierInfo>';
	invoicedata = invoicedata + '<supplierTaxNumber>';
	invoicedata = invoicedata + '<taxpayerId>' + data.supplierTaxpayerId + '</taxpayerId>';
	invoicedata = invoicedata + '<vatCode>' + data.supplierVatCode + '</vatCode>';
	invoicedata = invoicedata + '<countyCode>' + data.supplierCountyCode + '</countyCode>';
	invoicedata = invoicedata + '</supplierTaxNumber>';
	invoicedata = invoicedata + '<supplierName>' + data.supplierName + '</supplierName>';
	invoicedata = invoicedata + '<supplierAddress>';
	invoicedata = invoicedata + '<simpleAddress>';
	invoicedata = invoicedata + '<countryCode>HU</countryCode>';
	invoicedata = invoicedata + '<postalCode>' + data.supplierPostalCode + '</postalCode>';
	invoicedata = invoicedata + '<city>' + data.supplierCity + '</city>';
	invoicedata = invoicedata + '<additionalAddressDetail>' + data.supplierAdditionalAddressDetail + '</additionalAddressDetail>';
	invoicedata = invoicedata + '</simpleAddress>';
	invoicedata = invoicedata + '</supplierAddress>';
	if(data.supplierBankAccountNumber){
		invoicedata = invoicedata + '<supplierBankAccountNumber>' + data.supplierBankAccountNumber + '</supplierBankAccountNumber>';
	}
	invoicedata = invoicedata + '<individualExemption>' + data.individualExemption + '</individualExemption>';
	invoicedata = invoicedata + '</supplierInfo>';
	
	invoicedata = invoicedata + '<customerInfo>';
	if(data.customerTaxpayerId){
		invoicedata = invoicedata + '<customerTaxNumber>';
		invoicedata = invoicedata + '<taxpayerId>' + data.customerTaxpayerId + '</taxpayerId>';
		invoicedata = invoicedata + '<vatCode>' + data.customerVatCode + '</vatCode>';
		invoicedata = invoicedata + '<countyCode>' + data.customerCountyCode + '</countyCode>';
		invoicedata = invoicedata + '</customerTaxNumber>';
	}
	invoicedata = invoicedata + '<customerName>' + data.customerName + '</customerName>';
	invoicedata = invoicedata + '<customerAddress>';
	invoicedata = invoicedata + '<simpleAddress>';
	invoicedata = invoicedata + '<countryCode>HU</countryCode>';
	invoicedata = invoicedata + '<postalCode>' + data.customerPostalCode + '</postalCode>';
	invoicedata = invoicedata + '<city>' + data.customerCity + '</city>';
	invoicedata = invoicedata + '<additionalAddressDetail>' + data.customerAdditionalAddressDetail + '</additionalAddressDetail>';
	invoicedata = invoicedata + '</simpleAddress>';
	invoicedata = invoicedata + '</customerAddress>';
	if(data.customerBankAccountNumber){
		invoicedata = invoicedata + '<customerBankAccountNumber>' + data.customerBankAccountNumber + '</customerBankAccountNumber>';
	}
	invoicedata = invoicedata + '</customerInfo>';
	
	invoicedata = invoicedata + '<invoiceDetail>';
	invoicedata = invoicedata + '<invoiceCategory>' + data.invoiceCategory + '</invoiceCategory>';
	invoicedata = invoicedata + '<invoiceDeliveryDate>' + data.invoiceDeliveryDate + '</invoiceDeliveryDate>';
	invoicedata = invoicedata + '<currencyCode>HUF</currencyCode>';
	invoicedata = invoicedata + '<exchangeRate>1</exchangeRate>';
	if(data.paymentMethod){
		invoicedata = invoicedata + '<paymentMethod>' + data.paymentMethod + '</paymentMethod>';
	}
	if(data.paymentDate){
		invoicedata = invoicedata + '<paymentDate>' + data.paymentDate + '</paymentDate>';
	}
	if(data.cashAccountingIndicator){
		invoicedata = invoicedata + '<cashAccountingIndicator>true</cashAccountingIndicator>';
	}
	else{
		invoicedata = invoicedata + '<cashAccountingIndicator>false</cashAccountingIndicator>';
	}
	invoicedata = invoicedata + '<invoiceAppearance>' + data.invoiceAppearance + '</invoiceAppearance>';
	invoicedata = invoicedata + '</invoiceDetail>';
	
	/*CONTINUE HERE*/
	
	invoicedata = invoicedata + '</invoiceHead>';
	
	invoicedata = invoicedata + '</invoice>';
	invoicedata = invoicedata + '</invoiceMain>';
	invoicedata = invoicedata + '</InvoiceData>';
	
	console.log(invoicedata);
	return invoicedata.tobase64();
	
}

module.exports.buildInvoiceData = buildInvoiceData;