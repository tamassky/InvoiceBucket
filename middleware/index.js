var Transaction	= require("../models/transaction");
var middlewareObj = {};



middlewareObj.checkTransactionOwnership = function(req, res, next){
	if(req.session.username){
		Transaction.findOne({number: req.params.number}, function(err, foundTransaction){
			if(err || !foundTransaction){
				req.flash("error", "Tranzakció nem található");
				res.redirect("/dashboard");
			} else{
				if(foundTransaction.owner == req.session.username){
					next();
				} else{
					req.flash("error", "Hozzáférés megtagadva");
					res.redirect("/dashboard");
				}
			}
		});	
	} else{
		req.flash("error", "Hozzáférés megtagadva");
		res.redirect("/login");
	}
}



module.exports = middlewareObj;