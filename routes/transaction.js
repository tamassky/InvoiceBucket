var express		= require("express");
var router		= express.Router();
var sha512 		= require('js-sha512').sha512;
var aes			= require('aes-ecb');
var User 		= require("../models/user");
var Transaction	= require("../models/transaction");
var middleware  = require("../middleware");
var apireq		= require("../request/request");



//create transaction - type: create simplified
router.get("/new/CS", function(req, res){
	if(req.session.username){
		var date_now = new Date();
		Transaction.findOne({}).sort('-number').exec(function (err, member) {
			var newNumber
			if(!member)
				newNumber = 1;
			else
				newNumber = member.number+1;
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
									transactionValidation: [],
									annuled: false,
									annulmentId: null,
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
					Transaction.findOneAndUpdate({number: req.params.number}, {invoiceNumber: req.body.invoiceNumber, invoiceIssueDate: req.body.invoiceIssueDate, invoiceDeliveryDate: req.body.invoiceDeliveryDate, paymentMethod: req.body.paymentMethod, invoiceAppearance: req.body.invoiceAppearance, lastUpdateDate: date_now}, function(err, ft) {
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
router.get("/:number/supplier", middleware.checkTransactionOwnership, function(req, res){
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
					res.render("supplierCS", {username: req.session.username, transaction: foundTransaction});
			}
		}
	});
});



//update supplier data
router.post("/:number/supplier", middleware.checkTransactionOwnership, function(req, res){
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
					Transaction.findOneAndUpdate({number: req.params.number}, {supplierTaxpayerId: req.body.supplierTaxNumber.substring(0,8), supplierVatCode: req.body.supplierTaxNumber.substring(8,9), supplierCountyCode: req.body.supplierTaxNumber.substring(9,11), supplierName: req.body.supplierName, supplierPostalCode: req.body.supplierPostalCode, supplierCity: req.body.supplierCity, supplierAdditionalAddressDetail: req.body.supplierAdditionalAddressDetail, lastUpdateDate: date_now}, function(err, ft) {
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



//edit customer data
router.get("/:number/customer", middleware.checkTransactionOwnership, function(req, res){
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
					res.render("customerCS", {username: req.session.username, transaction: foundTransaction});
			}
		}
	});
});



//update customer data
router.post("/:number/customer", middleware.checkTransactionOwnership, function(req, res){
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
				var customerTaxpayerId = null;
				if(req.body.customerTaxNumber)
					customerTaxpayerId = req.body.customerTaxNumber.substring(0,8);
				var customerVatCode = null;
				if(req.body.customerTaxNumber)
					customerVatCode = req.body.customerTaxNumber.substring(8,9);
				var customerCountyCode = null;
				if(req.body.customerTaxNumber)
					customerCountyCode = req.body.customerTaxNumber.substring(9,11);
				
				if(foundTransaction.invoiceOperation == 'CREATE' && foundTransaction.invoiceCategory == 'SIMPLIFIED')
					Transaction.findOneAndUpdate({number: req.params.number}, {customerTaxpayerId: customerTaxpayerId, customerVatCode: customerVatCode, customerCountyCode: customerCountyCode, customerName: req.body.customerName, customerPostalCode: req.body.customerPostalCode, customerCity: req.body.customerCity, customerAdditionalAddressDetail: req.body.customerAdditionalAddressDetail, lastUpdateDate: date_now}, function(err, ft) {
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
					Transaction.findOneAndUpdate({number: req.params.number}, {vatContent: req.body.vatContent, invoiceGrossAmount: req.body.invoiceGrossAmount, lastUpdateDate: date_now}, function(err, ft) {
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



//sign transaction
router.post("/:number/sign", middleware.checkTransactionOwnership, function(req, res){
	var date_now = new Date();
	Transaction.findOne({number: req.params.number}).populate("lines").exec(function(err, foundTransaction){
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
				/*Validators*/
				if(!foundTransaction.invoiceNumber){
					req.flash("error", "Számla alapadatai hiányoznak!");
					return res.redirect('/transaction/' + req.params.number);
				}
				if(!foundTransaction.supplierName){
					req.flash("error", "Számlakibocsátó adatai hiányoznak!");
					return res.redirect('/transaction/' + req.params.number);
				}
				if(!foundTransaction.customerName){
					req.flash("error", "Vevő adatai hiányoznak!");
					return res.redirect('/transaction/' + req.params.number);
				}
				if(foundTransaction.lines.length == 0){
					req.flash("error", "Legalább egy sor felvétele szükséges!");
					return res.redirect('/transaction/' + req.params.number);
				}
				var invalidLine = false;
				foundTransaction.lines.forEach(function(line){
					if(line.unitOfMeasure == 'OWN' && line.unitOfMeasureOwn == '')
						invalidLine = true;
				});
				if(invalidLine){
					req.flash("error", "Hiányzó egyéni mértékegység megnevezések!");
					return res.redirect('/transaction/' + req.params.number);
				}
				if(!foundTransaction.invoiceGrossAmount){
					req.flash("error", "Összegző adatok hiányoznak!");
					return res.redirect('/transaction/' + req.params.number);
				}
				
				User.findOne({username: req.session.username, password: sha512(req.body.password)}, function(err, user) {
					if(err){
						console.log(err);
						req.flash("error", err.message);
						return res.redirect('/transaction/' + req.params.number);
					}
					if(!user){
						req.flash("error", "Hibás jelszó!");
						return res.redirect('/transaction/' + req.params.number);
					} 

					//decrypt technical data
					var key = req.body.password;
					if(key.length > 16)
						key = key.substring(0, 16);
					while(key.length < 16)
						key = key + 'X';

					var navUsername = aes.decrypt(key, user.navUsername);
					while(navUsername.charCodeAt(navUsername.length - 1) < 32)
						navUsername = navUsername.slice(0, -1);

					var navPassword	= aes.decrypt(key, user.navPassword);
					while(navPassword.charCodeAt(navPassword.length - 1) < 32)
						navPassword = navPassword.slice(0, -1);

					var xmlsign 	= aes.decrypt(key, user.xmlsign);
					while(xmlsign.charCodeAt(xmlsign.length - 1) < 32)
						xmlsign = xmlsign.slice(0, -1);
					
					var xmlexchange	= aes.decrypt(key, user.xmlexchange);
					while(xmlexchange.charCodeAt(xmlexchange.length - 1) < 32)
						xmlexchange = xmlexchange.slice(0, -1);

					//send API request
					var replyToClient = apireq.setRequest('manageInvoice', {login: navUsername, password: sha512(navPassword), xmlsign: xmlsign, xmlexchange: xmlexchange, taxNumber: user.taxNumber}, foundTransaction); 	
					new Promise((resolve, reject) => { 												
						if (replyToClient)														
							resolve(replyToClient);													
					})																				
					.then(replyToClient => {
						if(replyToClient == 'request_error'){
							req.flash("error", "Sikertelen azonosítás - lejárt technikai felhasználó vagy helytelen XML cserekulcs");
							return res.redirect('/transaction/' + req.params.number);
						}
						else{
							if(replyToClient == 'server_error'){
								req.flash("error", "Az Online Számla rendszer nem elérhető. Próbálkozz újra később!");
								return res.redirect('/transaction/' + req.params.number);
							}
							else{
								foundTransaction.transactionId = replyToClient;
								foundTransaction.transactionStatus = 'Aláírva';
								foundTransaction.lastUpdateDate = date_now;
								foundTransaction.save();
									
								req.flash("success", "Sikeres adatszolgáltatás! Kapott azonosító: " + replyToClient);
								res.redirect('/dashboard');
							}
						}
					});
				});	
			}
		}
	});
});



//annul transaction
router.post("/:number/annul", middleware.checkTransactionOwnership, function(req, res){
	var date_now = new Date();
	Transaction.findOne({number: req.params.number}).populate("lines").exec(function(err, foundTransaction){
		if(err){
			req.flash("error", err);
			res.redirect("/dashboard");
			console.log(err);
		} else{
			if(foundTransaction.transactionStatus != 'Elfogadva' && foundTransaction.transactionStatus != 'Elfogadva figyelmeztetésekkel'){
				req.flash("error", "A tranzakció nem érvényteleníthető");
				res.redirect("/dashboard");
			}
			else{
				User.findOne({username: req.session.username, password: sha512(req.body.password)}, function(err, user) {
					if(err){
						console.log(err);
						req.flash("error", err.message);
						return res.redirect('/transaction/' + req.params.number);
					}
					if(!user){
						req.flash("error", "Hibás jelszó!");
						return res.redirect('/transaction/' + req.params.number);
					} 

					//decrypt technical data
					var key = req.body.password;
					if(key.length > 16)
						key = key.substring(0, 16);
					while(key.length < 16)
						key = key + 'X';

					var navUsername = aes.decrypt(key, user.navUsername);
					while(navUsername.charCodeAt(navUsername.length - 1) < 32)
						navUsername = navUsername.slice(0, -1);

					var navPassword	= aes.decrypt(key, user.navPassword);
					while(navPassword.charCodeAt(navPassword.length - 1) < 32)
						navPassword = navPassword.slice(0, -1);

					var xmlsign 	= aes.decrypt(key, user.xmlsign);
					while(xmlsign.charCodeAt(xmlsign.length - 1) < 32)
						xmlsign = xmlsign.slice(0, -1);
					
					var xmlexchange	= aes.decrypt(key, user.xmlexchange);
					while(xmlexchange.charCodeAt(xmlexchange.length - 1) < 32)
						xmlexchange = xmlexchange.slice(0, -1);

					//send API request
					var replyToClient = apireq.setRequest('manageAnnulment', {login: navUsername, password: sha512(navPassword), xmlsign: xmlsign, xmlexchange: xmlexchange, taxNumber: user.taxNumber}, {annulmentReference: foundTransaction.invoiceNumber, annulmentTimestamp: date_now.toISOString(), annulmentCode: req.body.annulmentCode, annulmentReason: req.body.annulmentReason}); 	
					new Promise((resolve, reject) => { 												
						if (replyToClient)														
							resolve(replyToClient);													
					})																				
					.then(replyToClient => {
						if(replyToClient == 'request_error'){
							req.flash("error", "Sikertelen azonosítás - lejárt technikai felhasználó vagy helytelen XML cserekulcs");
							return res.redirect('/transaction/' + req.params.number);
						}
						else{
							if(replyToClient == 'server_error'){
								req.flash("error", "Az Online Számla rendszer nem elérhető. Próbálkozz újra később!");
								return res.redirect('/transaction/' + req.params.number);
							}
							else{
								foundTransaction.annuled = true;
								foundTransaction.annulmentId = replyToClient;
								foundTransaction.transactionStatus = 'Érvénytelenítve';
								foundTransaction.lastUpdateDate = date_now;
								foundTransaction.save();
									
								req.flash("success", "Érvénytelenítési kérelem befogadva! Kapott azonosító: " + replyToClient);
								req.flash("success", "Az érvénytelenítést jóvá kell hagyja egy erre jogosult felhasználó az Online Számla webes irányítópultjában.");
								res.redirect('/dashboard');
							}
						}
					});
				});	
			}
		}
	});
});
	


module.exports = router;
