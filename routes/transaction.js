var express		= require("express");
var router		= express.Router();
var User 		= require("../models/user");
var Transaction	= require("../models/transaction");
var middleware  = require("../middleware");
var apireq		= require("../request/request");



//create transaction - type: create simplified
router.get("/new/CS", function(req, res){
	if(req.session.username){
		var date_now = new Date();
		Transaction.findOne({}).sort('-number').exec(function (err, member) {
			var newNumber = member.number+1;
			var newTransaction = {
									number: newNumber,
									owner: req.session.username,
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
								};
			
			Transaction.create(newTransaction, function(err, newlyCreated){
				if(err){
					req.flash("success", err);
					res.redirect("/dashboard");
					console.log(err);
				} else{
					res.redirect("/transaction/" + newNumber);
				}
			});
		});
	}
	else
		res.redirect('/login');
});



//show transaction
router.get("/:number", middleware.checkTransactionOwnership, function(req, res){
	Transaction.findOne({number: req.params.number}).populate("lines").exec(function(err, foundTransaction){
		if(err){
			req.flash("error", err);
			res.redirect("/dashboard");
			console.log(err);
		} else{
			if(foundTransaction.disabled){
				req.flash("error", "A tranzakció törölve lett");
				res.redirect("/dashboard");
			}
			else{
				if(foundTransaction.invoiceOperation == 'CREATE' && foundTransaction.invoiceCategory == 'SIMPLIFIED')
					res.render("transactionCS", {username: req.session.username, transaction: foundTransaction});
			}
		}
	});
});



//delete transaction
router.get("/:number/delete", middleware.checkTransactionOwnership, function(req, res){
	Transaction.findOneAndUpdate({number: req.params.number}, {disabled: true}, function(err, foundTransaction){
		if(err){
			req.flash("error", err);
			res.redirect("/dashboard");
			console.log(err);
		} else{
			req.flash("success", "Törlés sikeres");
			res.redirect("/dashboard");
		}
	});
});



//edit basic invoice data
router.get("/:number/basicdata", middleware.checkTransactionOwnership, function(req, res){
	Transaction.findOne({number: req.params.number}, function(err, foundTransaction){
		if(err){
			req.flash("error", err);
			res.redirect("/dashboard");
			console.log(err);
		} else{
			if(foundTransaction.disabled || foundTransaction.transactionStatus != 'Piszkozat'){
				req.flash("error", "A tranzakció már alá lett írva vagy törölték");
				res.redirect("/dashboard");
			}
			else{
				if(foundTransaction.invoiceOperation == 'CREATE' && foundTransaction.invoiceCategory == 'SIMPLIFIED')
					res.render("basicdataCS", {username: req.session.username, transaction: foundTransaction});
			}
		}
	});
});



//update basic invoice data
router.post("/:number/basicdata", middleware.checkTransactionOwnership, function(req, res){
	var date_now = new Date();
	Transaction.findOne({number: req.params.number}, function(err, foundTransaction){
		if(err){
			req.flash("error", err);
			res.redirect("/dashboard");
			console.log(err);
		} else{
			if(foundTransaction.disabled || foundTransaction.transactionStatus != 'Piszkozat'){
				req.flash("error", "A tranzakció már alá lett írva vagy törölték");
				res.redirect("/dashboard");
			}
			else{
				if(foundTransaction.invoiceOperation == 'CREATE' && foundTransaction.invoiceCategory == 'SIMPLIFIED')
					Transaction.findOneAndUpdate({number: req.params.number}, {invoiceNumber: req.body.invoiceNumber, invoiceIssueDate: req.body.invoiceIssueDate, invoiceDeliveryDate: req.body.invoiceDeliveryDate, paymentMethod: req.body.paymentMethod, invoiceAppearance: req.body.invoiceAppearance, lastUpdateDate: date_now}, function(err, user) {
						if(err){
							console.log(err);
							req.flash("error", err.message);
							return res.redirect("/dashboard");
						}
						req.flash("success", "Mentés sikeres");
						res.redirect('/transaction/' + req.params.number);
					});
			}
		}
	});
});


//edit supplier data



//update supplier data



//edit customer data



//update customer data



//edit invoice summary
router.get("/:number/summary", middleware.checkTransactionOwnership, function(req, res){
	Transaction.findOne({number: req.params.number}, function(err, foundTransaction){
		if(err){
			req.flash("error", err);
			res.redirect("/dashboard");
			console.log(err);
		} else{
			if(foundTransaction.disabled || foundTransaction.transactionStatus != 'Piszkozat'){
				req.flash("error", "A tranzakció már alá lett írva vagy törölték");
				res.redirect("/dashboard");
			}
			else{
				if(foundTransaction.invoiceOperation == 'CREATE' && foundTransaction.invoiceCategory == 'SIMPLIFIED')
					res.render("summaryCS", {username: req.session.username, transaction: foundTransaction});
			}
		}
	});
});


//update invoice summary
router.post("/:number/summary", middleware.checkTransactionOwnership, function(req, res){
	var date_now = new Date();
	Transaction.findOne({number: req.params.number}, function(err, foundTransaction){
		if(err){
			req.flash("error", err);
			res.redirect("/dashboard");
			console.log(err);
		} else{
			if(foundTransaction.disabled || foundTransaction.transactionStatus != 'Piszkozat'){
				req.flash("error", "A tranzakció már alá lett írva vagy törölték");
				res.redirect("/dashboard");
			}
			else{
				if(foundTransaction.invoiceOperation == 'CREATE' && foundTransaction.invoiceCategory == 'SIMPLIFIED')
					Transaction.findOneAndUpdate({number: req.params.number}, {vatContent: req.body.vatContent, invoiceGrossAmount: req.body.invoiceGrossAmount, lastUpdateDate: date_now}, function(err, user) {
						if(err){
							console.log(err);
							req.flash("error", err.message);
							return res.redirect("/dashboard");
						}
						req.flash("success", "Mentés sikeres");
						res.redirect('/transaction/' + req.params.number);
					});
			}
		}
	});
});


module.exports = router;
