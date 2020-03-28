var express		= require("express");
var router		= express.Router();
var sha512 		= require('js-sha512').sha512;
var User 	 	= require("../models/user");

var date_now	= new Date();

//show landing page
router.get("/", function(req, res){
	res.render("landing", {username: req.session.username});
});

//show registration page
router.get("/register", function(req, res){
	res.render("register");
});

//registration logic
router.post("/register", function(req, res){
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
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		req.session.username = user.username;
		req.flash("success", "Regisztráció sikeres");
        res.redirect('/');
	});
});

//show login page
router.get("/login", function(req, res){
	res.render("login");
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

//logout loginc
router.get("/logout", function(req, res){
	req.session.username = undefined;
	req.flash("success", "Sikeres kijelentkezés");
	res.redirect('/');
});

module.exports = router;