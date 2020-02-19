var Base64 = require('js-base64').Base64;

function buildInvoiceData(data){
	
    var invoicedata = '';
	
	invoicedata = invoicedata + '<?xml version="1.0" encoding="UTF-8"?>';
	invoicedata = invoicedata + '<InvoiceData xmlns="http://schemas.nav.gov.hu/OSA/2.0/data" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://schemas.nav.gov.hu/OSA/2.0/data invoiceData.xsd">';
	invoicedata = invoicedata + '<invoiceNumber>' + data.invoiceNumber + '</invoiceNumber>';
	invoicedata = invoicedata + '<invoiceIssueDate>' + data.invoiceIssueDate + '</invoiceIssueDate>';
	invoicedata = invoicedata + '<invoiceMain>';
	invoicedata = invoicedata + '<invoice>';
	
	/*REFERENCE*/
	if(invoiceOperation != 'CREATE'){
		invoicedata = invoicedata + '<invoiceReference>';
		invoicedata = invoicedata + '<originalInvoiceNumber>' + data.originalInvoiceNumber +'</originalInvoiceNumber>';
		invoicedata = invoicedata + '<modifyWithoutMaster>false</modifyWithoutMaster>';
		invoicedata = invoicedata + '<modificationIndex>' + data.modificationIndex + '</modificationIndex>';
		invoicedata = invoicedata + '</invoiceReference>';
	}
	
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
	if(data.supplierBankAccountNumber){
		invoicedata = invoicedata + '<supplierBankAccountNumber>' + data.supplierBankAccountNumber + '</supplierBankAccountNumber>';
	}
	invoicedata = invoicedata + '<individualExemption>' + data.individualExemption + '</individualExemption>';
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
	if(data.customerBankAccountNumber){
		invoicedata = invoicedata + '<customerBankAccountNumber>' + data.customerBankAccountNumber + '</customerBankAccountNumber>';
	}
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
	
	/*LINES*/
	invoicedata = invoicedata + '<invoiceLines>';
	for(var i=0; i<data.lines.length; i++){
		invoicedata = invoicedata + '<line>';
		invoicedata = invoicedata + '<lineNumber>' + data.lines[i].lineNumber + '</lineNumber>';
		if(data.lines[i].lineNumberReference){
			invoicedata = invoicedata + '<lineModificationReference>';
			invoicedata = invoicedata + '<lineNumberReference>' + data.lines[i].lineNumberReference + '</lineNumberReference>';
			invoicedata = invoicedata + '<lineOperation>' + data.lines[i].lineOperation + '</lineOperation>';
			invoicedata = invoicedata + '</lineModificationReference>';
		}
		if(data.lines[i].productCodeValue){
		invoicedata = invoicedata + '<productCodes>';
		invoicedata = invoicedata + '<productCode>';
		invoicedata = invoicedata + '<productCodeCategory>' + data.lines[i].productCodeCategory + '</productCodeCategory>';
		if(data.lines[i].productCodeCategory == 'OWN'){
			invoicedata = invoicedata + '<productCodeOwnValue>' + data.lines[i].productCodeValue + '</productCodeOwnValue>';
		}
		else{
			invoicedata = invoicedata + '<productCodeValue>' + data.lines[i].productCodeValue + '</productCodeValue>';
		}
		invoicedata = invoicedata + '</productCode>';
		invoicedata = invoicedata + '</productCodes>';
		}
		if(data.lines[i].lineNatureIndicator){
			invoicedata = invoicedata + '<lineNatureIndicator>' + data.lines[i].lineNatureIndicator + '</lineNatureIndicator>';
		}
		invoicedata = invoicedata + '<lineDescription>' + data.lines[i].lineDescription + '</lineDescription>';
		invoicedata = invoicedata + '<quantity>' + data.lines[i].quantity + '.00</quantity>';
		invoicedata = invoicedata + '<unitOfMeasure>' + data.lines[i].unitOfMeasure + '</unitOfMeasure>';
		if(data.lines[i].unitOfMeasure == 'OWN'){
			invoicedata = invoicedata + '<unitOfMeasureOwn>' + data.lines[i].unitOfMeasureOwn + '</unitOfMeasureOwn>';
		}
		invoicedata = invoicedata + '<unitPrice>' + data.lines[i].unitPrice + '.00</unitPrice>';
		invoicedata = invoicedata + '<unitPriceHUF>' + data.lines[i].unitPrice + '.00</unitPriceHUF>';
		if(data.lines[i].intermediatedService){
		invoicedata = invoicedata + '<intermediatedService>' + data.lines[i].intermediatedService + '</intermediatedService>';
		}
		if(data.invoiceCategory == 'NORMAL'){
			invoicedata = invoicedata + '<lineAmountsNormal>';
			invoicedata = invoicedata + '<lineNetAmountData>';
			invoicedata = invoicedata + '<lineNetAmount>' + data.lines[i].lineNetAmount + '.00</lineNetAmount>';
			invoicedata = invoicedata + '<lineNetAmountHUF>' + data.lines[i].lineNetAmount + '.00</lineNetAmountHUF>';
			invoicedata = invoicedata + '</lineNetAmountData>';
			invoicedata = invoicedata + '<lineVatRate>';
			invoicedata = invoicedata + '<vatPercentage>' + (data.lines[i].vatPercentage / 100).toString() + '</vatPercentage>';
			invoicedata = invoicedata + '</lineVatRate>';
			invoicedata = invoicedata + '<lineVatData>';
			invoicedata = invoicedata + '<lineVatAmount>' + data.lines[i].lineVatAmount + '.00</lineVatAmount>';
			invoicedata = invoicedata + '<lineVatAmountHUF>' + data.lines[i].lineVatAmount + '.00</lineVatAmountHUF>';
			invoicedata = invoicedata + '</lineVatData>';
			invoicedata = invoicedata + '<lineGrossAmountData>';
			invoicedata = invoicedata + '<lineGrossAmountNormal>' + (data.lines[i].lineNetAmount + data.lines[i].lineVatAmount) + '.00</lineGrossAmountNormal>';
			invoicedata = invoicedata + '<lineGrossAmountNormalHUF>' + (data.lines[i].lineNetAmount + data.lines[i].lineVatAmount) + '.00</lineGrossAmountNormalHUF>';
			invoicedata = invoicedata + '</lineGrossAmountData>';
			invoicedata = invoicedata + '</lineAmountsNormal>';
		}
		if(data.invoiceCategory == 'SIMPLIFIED'){
			invoicedata = invoicedata + '<lineAmountsSimplified>';
			invoicedata = invoicedata + '<lineVatContent>' +  (data.lines[i].lineVatContentSimplified / 100).toString() + '</lineVatContent>';
			invoicedata = invoicedata + '<lineGrossAmountSimplified>' + data.lines[i].lineGrossAmountSimplified + '.00</lineGrossAmountSimplified>';
			invoicedata = invoicedata + '<lineGrossAmountSimplifiedHUF>' + data.lines[i].lineGrossAmountSimplified + '.00</lineGrossAmountSimplifiedHUF>';
			invoicedata = invoicedata + '</lineAmountsSimplified>';
		}
		invoicedata = invoicedata + '</line>';
	}
	invoicedata = invoicedata + '</invoiceLines>';
	
	/*SUMMARY*/
	invoicedata = invoicedata + '<invoiceSummary>';
	if(data.invoiceCategory == 'NORMAL'){
		invoicedata = invoicedata + '<summaryNormal>';
		for(var i=0; i<data.vatRates.length; i++){
			invoicedata = invoicedata + '<summaryByVatRate>';
			/*INDEV!!!!!!!!!!!!!!*/
			invoicedata = invoicedata + '</summaryByVatRate>';
		}
		invoicedata = invoicedata + '<invoiceNetAmount>' + data.invoiceNetAmount + '.00</invoiceNetAmount>';
		invoicedata = invoicedata + '<invoiceNetAmountHUF>' + data.invoiceNetAmount + '.00</invoiceNetAmountHUF>';
		invoicedata = invoicedata + '<invoiceVatAmount>' + data.invoiceVatAmount + '.00</invoiceVatAmount>';
		invoicedata = invoicedata + '<invoiceVatAmountHUF>' + data.invoiceVatAmount + '.00</invoiceVatAmountHUF>';
		invoicedata = invoicedata + '</summaryNormal>';
		invoicedata = invoicedata + '<summaryGrossData>';
		invoicedata = invoicedata + '<invoiceGrossAmount>' + data.invoiceGrossAmount + '.00</invoiceGrossAmount>';
		invoicedata = invoicedata + '<invoiceGrossAmountHUF>' + data.invoiceGrossAmount + '.00</invoiceGrossAmountHUF>';
		invoicedata = invoicedata + '</summaryGrossData>';
	}
	if(data.invoiceCategory == 'SIMPLIFIED'){
		invoicedata = invoicedata + '<summarySimplified>';
		invoicedata = invoicedata + '<vatContent>' + (data.vatContent / 100).toString() + '</vatContent>';
		invoicedata = invoicedata + '<vatContentGrossAmount>' + data.invoiceGrossAmount + '.00</vatContentGrossAmount>';
		invoicedata = invoicedata + '<vatContentGrossAmountHUF>' + data.invoiceGrossAmount + '.00</vatContentGrossAmountHUF>';
		invoicedata = invoicedata + '</summarySimplified>';
	}
	invoicedata = invoicedata + '</invoiceSummary>';
	
	invoicedata = invoicedata + '</invoiceHead>';
	
	invoicedata = invoicedata + '</invoice>';
	invoicedata = invoicedata + '</invoiceMain>';
	invoicedata = invoicedata + '</InvoiceData>';
	
	console.log(invoicedata);
	return invoicedata.tobase64();
	
}

module.exports.buildInvoiceData = buildInvoiceData;