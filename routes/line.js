var express		= require("express");
var router		= express.Router({mergeParams: true});
var Transaction	= require("../models/transaction");
var Line		= require("../models/line");
var middleware  = require("../middleware");



//new line
router.get("/new", middleware.checkTransactionOwnership, function(req, res){
	Transaction.findOne({number: req.params.number}, function(err, transaction){
		if(err){
			req.flash("error", err);
			res.redirect("/transaction/" + req.params.number);
			console.log(err);
		} else{
			if(transaction.invoiceOperation == 'CREATE' && transaction.invoiceCategory == 'SIMPLIFIED'){
				res.render("linenewCS", {username: req.session.username, transaction: transaction});
			}
		}
	});
});



//create line
router.post("/", middleware.checkTransactionOwnership, function(req, res){
	var date_now = new Date();
	Transaction.findOne({number: req.params.number}, function(err, foundTransaction){
		if(err){
			req.flash("error", err);
			res.redirect("/transaction/" + req.params.number);
			console.log(err);
		} else{
			if(foundTransaction.disabled || foundTransaction.transactionStatus != 'Piszkozat'){
				req.flash("error", "A tranzakció már alá lett írva vagy törölték");
				res.redirect("/dashboard");
			}
			else{
				var unitOfMeasureOwn = null;
				if(req.body.unitOfMeasure == 'OWN')
					unitOfMeasureOwn = req.body.unitOfMeasureOwn;
				if(foundTransaction.invoiceOperation == 'CREATE' && foundTransaction.invoiceCategory == 'SIMPLIFIED'){
					var newLine = {
									lineDescription: req.body.lineDescription,
									unitOfMeasure: req.body.unitOfMeasure,
									unitOfMeasureOwn: unitOfMeasureOwn,
									quantity: req.body.quantity,
									unitPrice: req.body.unitPrice,
									lineGrossAmountSimplified: req.body.lineGrossAmountSimplified
								};
					Line.create(newLine, function(err, line){
						if(err){
							req.flash("error", err);
							res.redirect("/transaction/" + req.params.number);
							console.log(err);
						} else{
							foundTransaction.lines.push(line);
							foundTransaction.lastUpdateDate = date_now;
							foundTransaction.save();
							req.flash("success", "Sor hozzáadva");
							res.redirect('/transaction/' + req.params.number);
						}
					})
				}
			}
		}
	});
});



//edit line
router.get("/:id/edit", middleware.checkTransactionOwnership, function(req, res){
	Transaction.findOne({number: req.params.number}, function(err, transaction){
		if(err){
			req.flash("error", err);
			res.redirect("/transaction/" + req.params.number);
			console.log(err);
		} else{
			Line.findById(req.params.id, function(err, line){
				if(err){
					req.flash("error", err);
					res.redirect("/transaction/" + req.params.number);
					console.log(err);
				} else {
					if(transaction.invoiceOperation == 'CREATE' && transaction.invoiceCategory == 'SIMPLIFIED'){
						res.render("lineeditCS", {username: req.session.username, transaction: transaction, line: line});
					}		
				}
			})	
		}
	});
});



//update line
router.put("/:id", middleware.checkTransactionOwnership, function(req, res){
	var date_now = new Date();
	Transaction.findOne({number: req.params.number}, function(err, foundTransaction){
		if(err){
			req.flash("error", err);
			res.redirect("/transaction/" + req.params.number);
			console.log(err);
		} else{
			if(foundTransaction.disabled || foundTransaction.transactionStatus != 'Piszkozat'){
				req.flash("error", "A tranzakció már alá lett írva vagy törölték");
				res.redirect("/dashboard");
			}
			else{
				var unitOfMeasureOwn = null;
				if(req.body.unitOfMeasure == 'OWN')
					unitOfMeasureOwn = req.body.unitOfMeasureOwn;
				if(foundTransaction.invoiceOperation == 'CREATE' && foundTransaction.invoiceCategory == 'SIMPLIFIED'){
					Line.findByIdAndUpdate(req.params.id, {lineDescription: req.body.lineDescription, unitOfMeasure: req.body.unitOfMeasure, unitOfMeasureOwn: unitOfMeasureOwn, quantity: req.body.quantity, unitPrice: req.body.unitPrice, lineGrossAmountSimplified: req.body.lineGrossAmountSimplified}, function(err, line){
						if(err){
							req.flash("error", err);
							res.redirect("/transaction/" + req.params.number);
							console.log(err);
						} else{
							foundTransaction.lastUpdateDate = date_now;
							foundTransaction.save();
							req.flash("success", "Sor frissítve");
							res.redirect('/transaction/' + req.params.number);
						}
					});
				}
			}
		}
	});
});



//delete line
router.delete("/:id", middleware.checkTransactionOwnership, function(req, res){
	var date_now = new Date();
	Transaction.findOne({number: req.params.number}, function(err, foundTransaction){
		if(err){
			req.flash("error", err);
			res.redirect("/transaction/" + req.params.number);
			console.log(err);
		} else{
			if(foundTransaction.disabled || foundTransaction.transactionStatus != 'Piszkozat'){
				req.flash("error", "A tranzakció már alá lett írva vagy törölték");
				res.redirect("/dashboard");
			}
			else{
				Line.findByIdAndRemove(req.params.id, function(err){
					if(err){
						req.flash("error", err);
						res.redirect("/transaction/" + req.params.number);
						console.log(err);
					} else{
						foundTransaction.lastUpdateDate = date_now;
						foundTransaction.save();
						req.flash("success", "Sor törölve");
						res.redirect('/transaction/' + req.params.number);
					}
				});
			}
		}
	});
});



module.exports = router;