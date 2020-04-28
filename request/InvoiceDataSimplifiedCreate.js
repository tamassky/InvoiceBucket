var Base64 = require('js-base64').Base64;

function buildInvoiceData(data){
	
    var invoicedata = '';
	
	invoicedata = invoicedata + '<?xml version="1.0" encoding="UTF-8"?>';
	invoicedata = invoicedata + '<InvoiceData xmlns="http://schemas.nav.gov.hu/OSA/2.0/data" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://schemas.nav.gov.hu/OSA/2.0/data invoiceData.xsd">';
	invoicedata = invoicedata + '<invoiceNumber>' + data.invoiceNumber + '</invoiceNumber>';
	invoicedata = invoicedata + '<invoiceIssueDate>' + data.invoiceIssueDate + '</invoiceIssueDate>';
	invoicedata = invoicedata + '<invoiceMain>';
	invoicedata = invoicedata + '<invoice>';
	
	invoicedata = invoicedata + '<invoiceHead>';
	
	/*SUPPLIER*/
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
	invoicedata = invoicedata + '<individualExemption>false</individualExemption>';
	invoicedata = invoicedata + '</supplierInfo>';
	
	/*CUSTOMER*/
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
	invoicedata = invoicedata + '</customerInfo>';
	
	/*INVOICE DETAILS*/
	invoicedata = invoicedata + '<invoiceDetail>';
	invoicedata = invoicedata + '<invoiceCategory>' + data.invoiceCategory + '</invoiceCategory>';
	invoicedata = invoicedata + '<invoiceDeliveryDate>' + data.invoiceDeliveryDate + '</invoiceDeliveryDate>';
	invoicedata = invoicedata + '<currencyCode>HUF</currencyCode>';
	invoicedata = invoicedata + '<exchangeRate>1</exchangeRate>';
	if(data.paymentMethod){
		invoicedata = invoicedata + '<paymentMethod>' + data.paymentMethod + '</paymentMethod>';
	}
	invoicedata = invoicedata + '<cashAccountingIndicator>false</cashAccountingIndicator>';
	invoicedata = invoicedata + '<invoiceAppearance>' + data.invoiceAppearance + '</invoiceAppearance>';
	invoicedata = invoicedata + '</invoiceDetail>';
	
	invoicedata = invoicedata + '</invoiceHead>';
	
	/*LINES*/
	invoicedata = invoicedata + '<invoiceLines>';
	for(var i=0; i<data.lines.length; i++){
		invoicedata = invoicedata + '<line>';
		invoicedata = invoicedata + '<lineNumber>' + (i+1).toString() + '</lineNumber>';
		invoicedata = invoicedata + '<lineExpressionIndicator>true</lineExpressionIndicator>';
		invoicedata = invoicedata + '<lineDescription>' + data.lines[i].lineDescription + '</lineDescription>';
		invoicedata = invoicedata + '<quantity>' + data.lines[i].quantity + '</quantity>';
		invoicedata = invoicedata + '<unitOfMeasure>' + data.lines[i].unitOfMeasure + '</unitOfMeasure>';
		if(data.lines[i].unitOfMeasure == 'OWN'){
			invoicedata = invoicedata + '<unitOfMeasureOwn>' + data.lines[i].unitOfMeasureOwn + '</unitOfMeasureOwn>';
		}
		invoicedata = invoicedata + '<unitPrice>' + data.lines[i].unitPrice + '</unitPrice>';
		invoicedata = invoicedata + '<unitPriceHUF>' + data.lines[i].unitPrice + '</unitPriceHUF>';
		invoicedata = invoicedata + '<lineAmountsSimplified>';
		invoicedata = invoicedata + '<lineVatContent>' + data.vatContent.toString() + '</lineVatContent>';
		invoicedata = invoicedata + '<lineGrossAmountSimplified>' + data.lines[i].lineGrossAmountSimplified + '</lineGrossAmountSimplified>';
		invoicedata = invoicedata + '<lineGrossAmountSimplifiedHUF>' + data.lines[i].lineGrossAmountSimplified + '</lineGrossAmountSimplifiedHUF>';
		invoicedata = invoicedata + '</lineAmountsSimplified>';
		invoicedata = invoicedata + '</line>';
	}
	invoicedata = invoicedata + '</invoiceLines>';
	
	/*SUMMARY*/
	invoicedata = invoicedata + '<invoiceSummary>';
	invoicedata = invoicedata + '<summarySimplified>';
	invoicedata = invoicedata + '<vatContent>' + data.vatContent.toString() + '</vatContent>';
	invoicedata = invoicedata + '<vatContentGrossAmount>' + data.invoiceGrossAmount + '</vatContentGrossAmount>';
	invoicedata = invoicedata + '<vatContentGrossAmountHUF>' + data.invoiceGrossAmount + '</vatContentGrossAmountHUF>';
	invoicedata = invoicedata + '</summarySimplified>';
	invoicedata = invoicedata + '<summaryGrossData>';
	invoicedata = invoicedata + '<invoiceGrossAmount>' + data.invoiceGrossAmount + '</invoiceGrossAmount>';
	invoicedata = invoicedata + '<invoiceGrossAmountHUF>' + data.invoiceGrossAmount + '</invoiceGrossAmountHUF>';
	invoicedata = invoicedata + '</summaryGrossData>';
	invoicedata = invoicedata + '</invoiceSummary>';
	
	invoicedata = invoicedata + '</invoice>';
	invoicedata = invoicedata + '</invoiceMain>';
	invoicedata = invoicedata + '</InvoiceData>';
	
	console.log(invoicedata);/**/
	return Base64.encode(invoicedata);
}

module.exports.buildInvoiceData = buildInvoiceData;