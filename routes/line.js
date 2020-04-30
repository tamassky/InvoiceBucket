var express		= require("express");
var router		= express.Router({mergeParams: true});
var Transaction	= require("../models/transaction");
var Line		= require("../models/line");
var middleware  = require("../middleware");



//new line
router.get("/new", middleware.checkTransactionOwnership, function(req, res){
	if(req.session.username){
		Transaction.findOne({number: req.params.number}, function(err, transaction){
			if(err){
				req.flash("error", err);
				res.redirect("/transaction/" + req.params.number);
				console.log(err);
			} else{
				res.render("linenewCS", {username: req.session.username, transaction: transaction});	
			}
		});
	} else{
		res.redirect('/login');
	}
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



//update line



//delete line



module.exports = router;