var mongoose = require("mongoose");

var transactionSchema = new mongoose.Schema({
	number: Number,
	owner: String,
	invoiceOperation: String,
	invoiceNumber: String,
	invoiceIssueDate: String,
	invoiceCategory: String,
	invoiceDeliveryDate: String,
	paymentMethod: String,
	invoiceAppearance: String,
	supplierTaxpayerId: String,
	supplierVatCode: String,
	supplierCountyCode: String,
	supplierName: String,
	supplierPostalCode: String,
	supplierCity: String,
	supplierAdditionalAddressDetail: String,
	customerTaxpayerId: String,
	customerVatCode: String,
	customerCountyCode: String,
	customerName: String,
	customerPostalCode: String,
	customerCity: String,
	customerAdditionalAddressDetail: String,
	lines: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Line"
		}
	],
	vatContent: String,
	invoiceGrossAmount: String,
	transactionId: String,
	transactionStatus: String,
	transactionResponse: String,
	transactionMessage: String,
	annuled: Boolean,
	annulmentCode: String,
	annulmentReason: String,
	creationDate: Date,
	lastUpdateDate: Date,
	disabled: Boolean
});

module.exports = mongoose.model("Transaction", transactionSchema);