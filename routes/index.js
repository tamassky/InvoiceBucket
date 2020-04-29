var express		= require("express");
var router		= express.Router();
var fs 			= require('fs');
var sha512 		= require('js-sha512').sha512;
var aes			= require('aes-ecb');
var base64 		= require('js-base64').Base64;
var User 		= require("../models/user");
var Transaction	= require("../models/transaction");
var apireq		= require("../request/request");



//show landing page
router.get("/", function(req, res){
	if(!req.session.username)
		res.render("landing", {username: req.session.username});
	else
		res.redirect('/dashboard');
});



//show registration page
router.get("/register", function(req, res){
	if(!req.session.username)
		res.render("register");
	else
		res.redirect('/dashboard');
});



//registration logic
router.post("/register", function(req, res){
	var date_now = new Date();
	User.create({
		username: req.body.username,
		password: sha512(req.body.password),
		navUsername: null,
		navPassword: null,
		xmlsign: null,
		xmlexchange: null,
		taxNumber: null,
		taxpayerName: null,
		creationDate: date_now,
		lastUpdateDate: date_now
	}, 
	function(err, user){
		if(err){
			console.log(err);
			if(err.code = 11000)
				req.flash("error", "Ez a felhasználónév már foglalt!");
			else
				req.flash("error", err.message);
			return res.redirect("/register");
		}
		req.session.username = user.username;
		req.flash("success", "Regisztráció sikeres");
        res.redirect('/techdata');
	});
});



//show login page
router.get("/login", function(req, res){
	if(!req.session.username)
		res.render("login");
	else
		res.redirect('/dashboard');
});



//login logic
router.post("/login", function(req, res){
	User.findOne({username: req.body.username, password: sha512(req.body.password)}, function(err, user) {
		if(err){
	        console.log(err);
			req.flash("error", err.message);
			return res.redirect("/login");
        }
		if(!user){
			req.flash("error", "Hibás belépési adatok!");
			return res.redirect("/login");
        } 
        req.session.username = user.username;
        req.flash("success", "Sikeres bejelentkezés");
		res.redirect('/dashboard');
    });
});



//logout logic
router.get("/logout", function(req, res){
	req.session.username = undefined;
	req.flash("success", "Sikeres kijelentkezés");
	res.redirect('/');
});



//show dashboard
router.get("/dashboard", function(req, res){
	if(req.session.username){
		User.findOne({username: req.session.username}, function(err, user) {
			if(err){
				console.log(err);
				req.flash("error", err.message);
				return res.redirect("/");
			}
			if(!user.navUsername){
				req.flash("error", "Technikai felhasználó adatai hiányoznak!");
				return res.redirect("/techdata");
			}
			Transaction.find({owner: req.session.username, disabled: false}, null, {sort: {number: -1}}, function(err, ownTransactions){
				if(err){
					console.log(err);
				} else{
					res.render("dashboard", {username: req.session.username, organization: user.taxpayerName, owntransactions: ownTransactions});
				}
			});
    	});
	}
	else
		res.redirect('/login');
})



//show technical data maintenance form
router.get("/techdata", function(req, res){
	if(req.session.username){
		res.render("techdata", {username: req.session.username});
	}
	else
		res.redirect('/login');
});



//save technical data
router.post("/techdata", function(req, res){
	var date_now	= new Date();
	var navUsername = req.body.navUsername;
	var navPassword = req.body.navPassword;
	var xmlsign 	= req.body.xmlsign;
	var xmlexchange = req.body.xmlexchange;
	var taxNumber 	= req.body.taxNumber;
	var password 	= req.body.password;
	
	User.findOne({username: req.session.username, password: sha512(password)}, function(err, user) {
		if(err){
	        console.log(err);
			req.flash("error", err.message);
			return res.redirect("/techdata");
        }
		if(!user){
			req.flash("error", "Hibás InvoiceBucket jelszó!");
			return res.redirect("/techdata");
        }
		var replyToClient = apireq.setRequest('queryTaxpayer', {login: navUsername, password: sha512(navPassword), xmlsign: xmlsign, xmlexchange: xmlexchange, taxNumber: taxNumber}, {taxNumber: taxNumber}); 	
		new Promise((resolve, reject) => { 												
			if (replyToClient)														
				resolve(replyToClient);													
		})																				
		.then(replyToClient => {
			if(replyToClient == 'request_error'){
				req.flash("error", "Érvénytelen adatok!");
				return res.redirect("/techdata");
			}
			else{
				if(replyToClient == 'server_error'){
					req.flash("error", "Az Online Számla rendszer nem elérhető. Próbálkozz újra később!");
					return res.redirect("/techdata");
				}
				else{
					var key = password;
					if(key.length > 16)
						key = key.substring(0, 16);
					while(key.length < 16)
						key = key + 'X';
					console.log(key);
					
					var navUsernameEnc 	= aes.encrypt(key, navUsername);
					var navPasswordEnc	= aes.encrypt(key, navPassword);
					var xmlsignEnc 		= aes.encrypt(key, xmlsign);
					var xmlexchangeEnc 	= aes.encrypt(key, xmlexchange);

					User.findOneAndUpdate({username: req.session.username}, {navUsername: navUsernameEnc, navPassword: navPasswordEnc, xmlsign: xmlsignEnc, xmlexchange: xmlexchangeEnc, taxNumber: taxNumber, taxpayerName: replyToClient.data.taxpayerName._text, creationDate: date_now, lastUpdateDate: date_now}, function(err, user) {
						if(err){
							console.log(err);
							req.flash("error", err.message);
							return res.redirect("/techdata");
						}
						req.flash("success", "Adatok mentése sikeres");
						res.redirect('/dashboard');
					});
				}
			}

		});
    });
});



//show password maintenance form
router.get("/pass", function(req, res){
	if(req.session.username){
		res.render("pass", {username: req.session.username});
	}
	else
		res.redirect('/login');
});



//save new password
router.post("/pass", function(req, res){
	var date_now	= new Date();
	
	
	User.findOne({username: req.session.username, password: sha512(req.body.oldPass)}, function(err, user) {
		if(err){
	        console.log(err);
			req.flash("error", err.message);
			return res.redirect("/pass");
        }
		if(!user){
			req.flash("error", "Jelenlegi jelszó hibás!");
			return res.redirect("/pass");
        }
		
		//decrypt technical data
		var key = req.body.oldPass;
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
		
		var xmlexchange = aes.decrypt(key, user.xmlexchange);
		while(xmlexchange.charCodeAt(xmlexchange.length - 1) < 32)
				xmlexchange = xmlexchange.slice(0, -1);
		
		//encrypt technical data with new password
		var key = req.body.newPass;
		if(key.length > 16)
			key = key.substring(0, 16);
		while(key.length < 16)
			key = key + 'X';
		
		var navUsernameEnc 	= aes.encrypt(key, navUsername);
		var navPasswordEnc	= aes.encrypt(key, navPassword);
		var xmlsignEnc 		= aes.encrypt(key, xmlsign);
		var xmlexchangeEnc 	= aes.encrypt(key, xmlexchange);
		
		User.findOneAndUpdate({username: req.session.username}, {password: sha512(req.body.newPass), navUsername: navUsernameEnc, navPassword: navPasswordEnc, xmlsign: xmlsignEnc, xmlexchange: xmlexchangeEnc, creationDate: date_now, lastUpdateDate: date_now}, function(err, user) {
			if(err){
				console.log(err);
				req.flash("error", err.message);
				return res.redirect("/pass");
			}
			req.flash("success", "Jelszóváltoztatás sikeres");
			res.redirect('/');
		});
    });
});



//view taxpayer info form
router.get("/taxpayerdata", function(req, res){
	if(req.session.username){
		User.findOne({username: req.session.username}, function(err, user) {
			if(err){
				console.log(err);
				req.flash("error", err.message);
				return res.redirect("/");
			}
			if(!user.navUsername){
				req.flash("error", "Technikai felhasználó adatai hiányoznak!");
				return res.redirect("/techdata");
			}
			res.render("taxpayerdata", {username: req.session.username, organization: user.taxpayerName});
    	});
	}
	else
		res.redirect('/login');	
});



//query taxpayer taxpayerdata
router.post("/taxpayerdata", function(req, res){
	User.findOne({username: req.session.username, password: sha512(req.body.password)}, function(err, user) {
		if(err){
	        console.log(err);
			req.flash("error", err.message);
			return res.redirect("/taxpayerdata");
        }
		if(!user){
			req.flash("error", "Hibás jelszó!");
			return res.redirect("/taxpayerdata");
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
		
		//send API request
		var replyToClient = apireq.setRequest('queryTaxpayer', {login: navUsername, password: sha512(navPassword), xmlsign: xmlsign, xmlexchange: null, taxNumber: user.taxNumber}, {taxNumber: req.body.taxNumber}); 	
		new Promise((resolve, reject) => { 												
			if (replyToClient)														
				resolve(replyToClient);													
		})																				
		.then(replyToClient => {
			if(replyToClient == 'request_error'){
				req.flash("error", "Sikertelen azonosítás vagy érvénytelen adószám");
				return res.redirect("/taxpayerdata");
			}
			else{
				if(replyToClient == 'server_error'){
					req.flash("error", "Az Online Számla rendszer nem elérhető. Próbálkozz újra később!");
					return res.redirect("/taxpayerdata");
				}
				else{
					if(replyToClient.validity._text == 'false')
						req.flash("success", "Az azonosítás sikeres volt, de az adószám nem érvényes.");
					else{
						var address = replyToClient.data.taxpayerAddressList.taxpayerAddressItem.taxpayerAddress;
						req.flash("success", replyToClient.data.taxpayerName._text);
						if(address.hasOwnProperty(['ns2:postalCode']))
							req.flash("success", 'Irányítószám: ' + address['ns2:postalCode']._text);
						if(address.hasOwnProperty(['ns2:city']))
							req.flash("success", 'Település: ' + address['ns2:city']._text);
						if(address.hasOwnProperty(['ns2:streetName']))
							req.flash("success", 'Közterület neve: ' + address['ns2:streetName']._text);
						if(address.hasOwnProperty(['ns2:publicPlaceCategory']))
							req.flash("success", 'Közterület jellege: ' + address['ns2:publicPlaceCategory']._text);
						if(address.hasOwnProperty(['ns2:number']))
							req.flash("success", 'Házszám: ' + address['ns2:number']._text);
						if(address.hasOwnProperty(['ns2:building']))
							req.flash("success", 'Épület: ' + address['ns2:building']._text);
						if(address.hasOwnProperty(['ns2:staircase']))
							req.flash("success", 'Lépcsőház: ' + address['ns2:staircase']._text);
						if(address.hasOwnProperty(['ns2:floor']))
							req.flash("success", 'Emelet: ' + address['ns2:floor']._text);
						if(address.hasOwnProperty(['ns2:door']))
							req.flash("success", 'Ajtó: ' + address['ns2:door']._text);
						if(address.hasOwnProperty(['ns2:lotNumber']))
							req.flash("success", 'Helyrajzi szám: ' + address['ns2:lotNumber']._text);
					}
					res.redirect('/taxpayerdata');
				}
			}
		});
    });
});



//view outbound invoice data form
router.get("/arinvoicedata", function(req, res){
	if(req.session.username){
		User.findOne({username: req.session.username}, function(err, user) {
			if(err){
				console.log(err);
				req.flash("error", err.message);
				return res.redirect("/");
			}
			if(!user.navUsername){
				req.flash("error", "Technikai felhasználó adatai hiányoznak!");
				return res.redirect("/techdata");
			}
			res.render("arinvoicedata", {username: req.session.username, organization: user.taxpayerName});
    	});
	}
	else
		res.redirect('/login');	
});



//query outbound invoice data
router.post("/arinvoicedata", function(req, res){
	User.findOne({username: req.session.username, password: sha512(req.body.password)}, function(err, user) {
		if(err){
	        console.log(err);
			req.flash("error", err.message);
			return res.redirect("/arinvoicedata");
        }
		if(!user){
			req.flash("error", "Hibás jelszó!");
			return res.redirect("/arinvoicedata");
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
		
		//send API request
		var replyToClient = apireq.setRequest('queryInvoiceCheck', {login: navUsername, password: sha512(navPassword), xmlsign: xmlsign, xmlexchange: null, taxNumber: user.taxNumber}, {invoiceNumber: req.body.invoiceNumber, invoiceDirection: 'OUTBOUND', batchIndex: null, supplierTaxNumber: null}); 	
		new Promise((resolve, reject) => { 												
			if (replyToClient)														
				resolve(replyToClient);													
		})																				
		.then(replyToClient => {
			if(replyToClient == 'request_error'){
				req.flash("error", "Hiba a kérés teljesítése közben");
				return res.redirect("/arinvoicedata");
			}
			else{
				if(replyToClient == 'server_error'){
					req.flash("error", "Az Online Számla rendszer nem elérhető. Próbálkozz újra később!");
					return res.redirect("/arinvoicedata");
				}
				else{
					if(replyToClient == 'false'){
						req.flash("error", "Nem létező számla");
						return res.redirect('/arinvoicedata');
					}
					else{
						var replyToClient2 = apireq.setRequest('queryInvoiceData', {login: navUsername, password: sha512(navPassword), xmlsign: xmlsign, xmlexchange: null, taxNumber: user.taxNumber}, {invoiceNumber: req.body.invoiceNumber, invoiceDirection: 'OUTBOUND', batchIndex: null, supplierTaxNumber: null}); 	
						new Promise((resolve, reject) => { 												
							if (replyToClient2)														
								resolve(replyToClient2);													
						})																				
						.then(replyToClient2 => {
							if(replyToClient2 == 'request_error'){
								req.flash("error", "Hiba a kérés teljesítése közben");
								return res.redirect("/arinvoicedata");
							}
							else{
								if(replyToClient2 == 'server_error'){
									req.flash("error", "Az Online Számla rendszer nem elérhető. Próbálkozz újra később!");
									return res.redirect("/arinvoicedata");
								}
								else{
									var tofile = base64.decode(replyToClient2.invoiceData._text);
									
									fs.writeFileSync(user.username + "_invoice_data.xml", tofile);
									
									res.download(user.username + "_invoice_data.xml", function(err){
										fs.unlinkSync(user.username + "_invoice_data.xml");
									});
								}
							}
						});
					}
				}
			}
		});
    });
});



//view inbound invoice data form
router.get("/apinvoicedata", function(req, res){
	if(req.session.username){
		User.findOne({username: req.session.username}, function(err, user) {
			if(err){
				console.log(err);
				req.flash("error", err.message);
				return res.redirect("/");
			}
			if(!user.navUsername){
				req.flash("error", "Technikai felhasználó adatai hiányoznak!");
				return res.redirect("/techdata");
			}
			res.render("apinvoicedata", {username: req.session.username, organization: user.taxpayerName});
    	});
	}
	else
		res.redirect('/login');	
});



//query inbound invoice data
router.post("/apinvoicedata", function(req, res){
	User.findOne({username: req.session.username, password: sha512(req.body.password)}, function(err, user) {
		if(err){
	        console.log(err);
			req.flash("error", err.message);
			return res.redirect("/apinvoicedata");
        }
		if(!user){
			req.flash("error", "Hibás jelszó!");
			return res.redirect("/apinvoicedata");
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
		
		//send API request
		var replyToClient = apireq.setRequest('queryInvoiceCheck', {login: navUsername, password: sha512(navPassword), xmlsign: xmlsign, xmlexchange: null, taxNumber: user.taxNumber}, {invoiceNumber: req.body.invoiceNumber, invoiceDirection: 'INBOUND', batchIndex: null, supplierTaxNumber: req.body.taxNumber}); 	
		new Promise((resolve, reject) => { 												
			if (replyToClient)														
				resolve(replyToClient);													
		})																				
		.then(replyToClient => {
			if(replyToClient == 'request_error'){
				req.flash("error", "Hiba a kérés teljesítése közben");
				return res.redirect("/apinvoicedata");
			}
			else{
				if(replyToClient == 'server_error'){
					req.flash("error", "Az Online Számla rendszer nem elérhető. Próbálkozz újra később!");
					return res.redirect("/apinvoicedata");
				}
				else{
					if(replyToClient == 'false'){
						req.flash("error", "Nem létező számla");
						return res.redirect('/apinvoicedata');
					}
					else{
						var replyToClient2 = apireq.setRequest('queryInvoiceData', {login: navUsername, password: sha512(navPassword), xmlsign: xmlsign, xmlexchange: null, taxNumber: user.taxNumber}, {invoiceNumber: req.body.invoiceNumber, invoiceDirection: 'INBOUND', batchIndex: null, supplierTaxNumber: req.body.taxNumber}); 	
						new Promise((resolve, reject) => { 												
							if (replyToClient2)														
								resolve(replyToClient2);													
						})																				
						.then(replyToClient2 => {
							if(replyToClient2 == 'request_error'){
								req.flash("error", "Hiba a kérés teljesítése közben");
								return res.redirect("/apinvoicedata");
							}
							else{
								if(replyToClient2 == 'server_error'){
									req.flash("error", "Az Online Számla rendszer nem elérhető. Próbálkozz újra később!");
									return res.redirect("/apinvoicedata");
								}
								else{
									var tofile = base64.decode(replyToClient2.invoiceData._text);
									
									fs.writeFileSync(user.username + "_invoice_data.xml", tofile);
									
									res.download(user.username + "_invoice_data.xml", function(err){
										fs.unlinkSync(user.username + "_invoice_data.xml");
									});
								}
							}
						});
					}
				}
			}
		});
    });
});



module.exports = router;