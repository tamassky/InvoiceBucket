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
	if(data.invoiceOperation != 'CREATE'){
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
	
	invoicedata = invoicedata + '</invoiceHead>';
	
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
		invoicedata = invoicedata + '<lineExpressionIndicator>true</lineExpressionIndicator>';
		if(data.lines[i].lineNatureIndicator){
			invoicedata = invoicedata + '<lineNatureIndicator>' + data.lines[i].lineNatureIndicator + '</lineNatureIndicator>';
		}
		invoicedata = invoicedata + '<lineDescription>' + data.lines[i].lineDescription + '</lineDescription>';
		invoicedata = invoicedata + '<quantity>' + data.lines[i].quantity + '</quantity>';
		invoicedata = invoicedata + '<unitOfMeasure>' + data.lines[i].unitOfMeasure + '</unitOfMeasure>';
		if(data.lines[i].unitOfMeasure == 'OWN'){
			invoicedata = invoicedata + '<unitOfMeasureOwn>' + data.lines[i].unitOfMeasureOwn + '</unitOfMeasureOwn>';
		}
		invoicedata = invoicedata + '<unitPrice>' + data.lines[i].unitPrice + '</unitPrice>';
		invoicedata = invoicedata + '<unitPriceHUF>' + data.lines[i].unitPrice + '</unitPriceHUF>';
		if(data.lines[i].intermediatedService){
		invoicedata = invoicedata + '<intermediatedService>' + data.lines[i].intermediatedService + '</intermediatedService>';
		}
		if(data.invoiceCategory == 'NORMAL'){
			invoicedata = invoicedata + '<lineAmountsNormal>';
			invoicedata = invoicedata + '<lineNetAmountData>';
			invoicedata = invoicedata + '<lineNetAmount>' + data.lines[i].lineNetAmount + '</lineNetAmount>';
			invoicedata = invoicedata + '<lineNetAmountHUF>' + data.lines[i].lineNetAmount + '</lineNetAmountHUF>';
			invoicedata = invoicedata + '</lineNetAmountData>';
			invoicedata = invoicedata + '<lineVatRate>';
			invoicedata = invoicedata + '<vatPercentage>' + (data.lines[i].vatPercentage / 100).toString() + '</vatPercentage>';
			invoicedata = invoicedata + '</lineVatRate>';
			invoicedata = invoicedata + '<lineVatData>';
			invoicedata = invoicedata + '<lineVatAmount>' + data.lines[i].lineVatAmount + '</lineVatAmount>';
			invoicedata = invoicedata + '<lineVatAmountHUF>' + data.lines[i].lineVatAmount + '</lineVatAmountHUF>';
			invoicedata = invoicedata + '</lineVatData>';
			invoicedata = invoicedata + '<lineGrossAmountData>';
			invoicedata = invoicedata + '<lineGrossAmountNormal>' + (Number(data.lines[i].lineNetAmount) + Number(data.lines[i].lineVatAmount)) + '</lineGrossAmountNormal>';
			invoicedata = invoicedata + '<lineGrossAmountNormalHUF>' + (Number(data.lines[i].lineNetAmount) + Number(data.lines[i].lineVatAmount)) + '</lineGrossAmountNormalHUF>';
			invoicedata = invoicedata + '</lineGrossAmountData>';
			invoicedata = invoicedata + '</lineAmountsNormal>';
		}
		if(data.invoiceCategory == 'SIMPLIFIED'){
			invoicedata = invoicedata + '<lineAmountsSimplified>';
			invoicedata = invoicedata + '<lineVatContent>' +  (data.lines[i].lineVatContentSimplified / 100).toString() + '</lineVatContent>';
			invoicedata = invoicedata + '<lineGrossAmountSimplified>' + data.lines[i].lineGrossAmountSimplified + '</lineGrossAmountSimplified>';
			invoicedata = invoicedata + '<lineGrossAmountSimplifiedHUF>' + data.lines[i].lineGrossAmountSimplified + '</lineGrossAmountSimplifiedHUF>';
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
			invoicedata = invoicedata + '<vatRate>';
			if(data.vatRates[i].vatPercentage){
				invoicedata = invoicedata + '<vatPercentage>' + (data.vatRates[i].vatPercentage / 100).toString() + '</vatPercentage>';
			}
			if(data.vatRates[i].vatExemption){
				invoicedata = invoicedata + '<vatExemption>' + data.vatRates[i].vatExemption + '</vatExemption>';
			}
			if(data.vatRates[i].vatOutOfScope){
				invoicedata = invoicedata + '<vatOutOfScope>' + data.vatRates[i].vatOutOfScope + '</vatOutOfScope>';
			}
			if(data.vatRates[i].vatDomesticReverseCharge){
				invoicedata = invoicedata + '<vatDomesticReverseCharge>' + data.vatRates[i].vatDomesticReverseCharge + '</vatDomesticReverseCharge>';
			}
			if(data.vatRates[i].marginSchemeVat){
				invoicedata = invoicedata + '<marginSchemeVat>' + data.vatRates[i].marginSchemeVat + '</marginSchemeVat>';
			}
			if(data.vatRates[i].marginSchemeNoVat){
				invoicedata = invoicedata + '<marginSchemeNoVat>' + data.vatRates[i].marginSchemeNoVat + '</marginSchemeNoVat>';
			}
			invoicedata = invoicedata + '</vatRate>';
			invoicedata = invoicedata + '<vatRateNetData>';
			invoicedata = invoicedata + '<vatRateNetAmount>' + data.vatRates[i].vatRateNetAmount + '</vatRateNetAmount>';
			invoicedata = invoicedata + '<vatRateNetAmountHUF>' + data.vatRates[i].vatRateNetAmount + '</vatRateNetAmountHUF>';
			invoicedata = invoicedata + '</vatRateNetData>';
			invoicedata = invoicedata + '<vatRateVatData>';
			invoicedata = invoicedata + '<vatRateVatAmount>' + data.vatRates[i].vatRateVatAmount + '</vatRateVatAmount>';
			invoicedata = invoicedata + '<vatRateVatAmountHUF>' + data.vatRates[i].vatRateVatAmount + '</vatRateVatAmountHUF>';
			invoicedata = invoicedata + '</vatRateVatData>';
			invoicedata = invoicedata + '</summaryByVatRate>';
		}
		invoicedata = invoicedata + '<invoiceNetAmount>' + data.invoiceNetAmount + '</invoiceNetAmount>';
		invoicedata = invoicedata + '<invoiceNetAmountHUF>' + data.invoiceNetAmount + '</invoiceNetAmountHUF>';
		invoicedata = invoicedata + '<invoiceVatAmount>' + data.invoiceVatAmount + '</invoiceVatAmount>';
		invoicedata = invoicedata + '<invoiceVatAmountHUF>' + data.invoiceVatAmount + '</invoiceVatAmountHUF>';
		invoicedata = invoicedata + '</summaryNormal>';
		invoicedata = invoicedata + '<summaryGrossData>';
		invoicedata = invoicedata + '<invoiceGrossAmount>' + data.invoiceGrossAmount + '</invoiceGrossAmount>';
		invoicedata = invoicedata + '<invoiceGrossAmountHUF>' + data.invoiceGrossAmount + '</invoiceGrossAmountHUF>';
		invoicedata = invoicedata + '</summaryGrossData>';
	}
	if(data.invoiceCategory == 'SIMPLIFIED'){
		invoicedata = invoicedata + '<summarySimplified>';
		invoicedata = invoicedata + '<vatContent>' + (data.vatContent / 100).toString() + '</vatContent>';
		invoicedata = invoicedata + '<vatContentGrossAmount>' + data.invoiceGrossAmount + '</vatContentGrossAmount>';
		invoicedata = invoicedata + '<vatContentGrossAmountHUF>' + data.invoiceGrossAmount + '</vatContentGrossAmountHUF>';
		invoicedata = invoicedata + '</summarySimplified>';
	}
	invoicedata = invoicedata + '</invoiceSummary>';
	
	invoicedata = invoicedata + '</invoice>';
	invoicedata = invoicedata + '</invoiceMain>';
	invoicedata = invoicedata + '</InvoiceData>';
	
	console.log(invoicedata);/**/
	return Base64.encode(invoicedata);
}

module.exports.buildInvoiceData = buildInvoiceData;