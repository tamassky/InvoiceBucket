var express		= require("express");
var router		= express.Router();
var sha512 		= require('js-sha512').sha512;
var aes			= require('aes-ecb');
var User 	 	= require("../models/user");
var apireq		= require("../request/request");

//show landing page
router.get("/", function(req, res){
	res.render("landing", {username: req.session.username});
});

//show registration page
router.get("/register", function(req, res){
	if(!req.session.username)
		res.render("register");
	else
		res.redirect('/');
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
		res.redirect('/');
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
		res.redirect('/');
    });
});

//logout logic
router.get("/logout", function(req, res){
	req.session.username = undefined;
	req.flash("success", "Sikeres kijelentkezés");
	res.redirect('/');
});

//show technical data maintenance form
router.get("/techdata", function(req, res){
	if(req.session.username)
		res.render("techdata", {username: req.session.username});
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
						res.redirect('/');
					});
				}
			}

		});
    });
});

//show password maintenance form
router.get("/pass", function(req, res){
	if(req.session.username)
		res.render("pass", {username: req.session.username});
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

module.exports = router;