var mongoose = require("mongoose");
var Transaction  = require("./models/transaction");

var date_now = new Date();

var data = [
    {
		number: 1,
		owner: 'tamassky',
		invoiceOperation: 'CREATE',
		invoiceNumber: '2020/300025',
		invoiceIssueDate: '2020-02-25',
		invoiceCategory: 'SIMPLIFIED',
		invoiceDeliveryDate: '2020-02-25',
		paymentMethod: 'CASH',
		invoiceAppearance: 'PAPER',
		supplierTaxpayerId: '10683424',
		supplierVatCode: '2',
		supplierCountyCode: '09',
		supplierName: 'DANIELLA KERESKEDELMI KORLÁTOLT FELELŐSSÉGŰ TÁRSASÁG',
		supplierPostalCode: '4031',
		supplierCity: 'DEBRECEN',
		supplierAdditionalAddressDetail: 'KÖNTÖSGÁT SOR 1-3',
		customerTaxpayerId: '13337940',
		customerVatCode: '2',
		customerCountyCode: '09',
		customerName: 'DANIELLA IPARI PARK SZOLGÁLTATÓ KORLÁTOLT FELELŐSSÉGŰ TÁRSASÁG',
		customerPostalCode: '4031',
		customerCity: 'DEBRECEN',
		customerAdditionalAddressDetail: 'KÖNTÖSGÁT SOR 1-3',
		lines: [],
		vatContent: '0.0476',
		invoiceGrossAmount: '8400',
		transactionId: null,
		transactionStatus: 'Piszkozat',
		transactionResponse: null,
		transactionMessage: null,
		annuled: null,
		annulmentCode: null,
		annulmentReason: null,
		creationDate: date_now,
		lastUpdateDate: date_now,
		disabled: false
    },
    {
		number: 2,
		owner: 'tamassky',
		invoiceOperation: 'CREATE',
		invoiceNumber: '2020/300025',
		invoiceIssueDate: '2020-02-25',
		invoiceCategory: 'SIMPLIFIED',
		invoiceDeliveryDate: '2020-02-25',
		paymentMethod: 'CASH',
		invoiceAppearance: 'PAPER',
		supplierTaxpayerId: '10683424',
		supplierVatCode: '2',
		supplierCountyCode: '09',
		supplierName: 'DANIELLA KERESKEDELMI KORLÁTOLT FELELŐSSÉGŰ TÁRSASÁG',
		supplierPostalCode: '4031',
		supplierCity: 'DEBRECEN',
		supplierAdditionalAddressDetail: 'KÖNTÖSGÁT SOR 1-3',
		customerTaxpayerId: '13337940',
		customerVatCode: '2',
		customerCountyCode: '09',
		customerName: 'DANIELLA IPARI PARK SZOLGÁLTATÓ KORLÁTOLT FELELŐSSÉGŰ TÁRSASÁG',
		customerPostalCode: '4031',
		customerCity: 'DEBRECEN',
		customerAdditionalAddressDetail: 'KÖNTÖSGÁT SOR 1-3',
		lines: [],
		vatContent: '0.0476',
		invoiceGrossAmount: '8400',
		transactionId: null,
		transactionStatus: 'Not Piszkozat',
		transactionResponse: null,
		transactionMessage: null,
		annuled: null,
		annulmentCode: null,
		annulmentReason: null,
		creationDate: date_now,
		lastUpdateDate: date_now,
		disabled: false
    },
    {
		number: 3,
		owner: 'tamassky',
		invoiceOperation: 'CREATE',
		invoiceNumber: null,
		invoiceIssueDate: null,
		invoiceCategory: 'SIMPLIFIED',
		invoiceDeliveryDate: null,
		paymentMethod: null,
		invoiceAppearance: null,
		supplierTaxpayerId: null,
		supplierVatCode: null,
		supplierCountyCode: null,
		supplierName: null,
		supplierPostalCode: null,
		supplierCity: null,
		supplierAdditionalAddressDetail: null,
		customerTaxpayerId: null,
		customerVatCode: null,
		customerCountyCode: null,
		customerName: null,
		customerPostalCode: null,
		customerCity: null,
		customerAdditionalAddressDetail: null,
		lines: [],
		vatContent: null,
		invoiceGrossAmount: null,
		transactionId: null,
		transactionStatus: 'Piszkozat',
		transactionResponse: null,
		transactionMessage: null,
		annuled: null,
		annulmentCode: null,
		annulmentReason: null,
		creationDate: date_now,
		lastUpdateDate: date_now,
		disabled: false
    }
]

function seedDB(){
   //Remove all transactions
   Transaction.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed transactions!");
		 //add a few transactions
		data.forEach(function(seed){
			Transaction.create(seed, function(err, transaction){
				if(err){
					console.log(err)
				} else {
					console.log("added a transaction");
				}
			});
		});
    }); 
}

module.exports = seedDB;