var mongoose = require("mongoose");
var Transaction  = require("./models/transaction");

var date_now = new Date();

var data = [
    {
		owner: 'tamassky',
        number: 1, 
        invoiceOperation: 'CREATE',
        invoiceCategory: 'SIMPLIFIED',
		transactionStatus: 'Piszkozat',
		invoiceNumber: null,
		transactionId: null,
		creationDate: date_now,
		lastUpdateDate: date_now
    },
    {
		owner: 'tamassky',
		number: 2, 
        invoiceOperation: 'CREATE',
        invoiceCategory: 'SIMPLIFIED',
		transactionStatus: 'Piszkozat',
		invoiceNumber: null,
		transactionId: null,
		creationDate: date_now,
		lastUpdateDate: date_now
    },
    {
		owner: 'tamassky',
		number: 3, 
        invoiceOperation: 'CREATE',
        invoiceCategory: 'SIMPLIFIED',
		transactionStatus: 'Piszkozat',
		invoiceNumber: null,
		transactionId: null,
		creationDate: date_now,
		lastUpdateDate: date_now,
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