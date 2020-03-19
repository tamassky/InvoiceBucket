var express		= require("express");
var router		= express.Router();
var sha512 		= require('js-sha512').sha512;
var User 	 	= require("../models/user");

var date_now	= new Date();

//show landing page
router.get("/", function(req, res){
	res.render("landing");
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
		req.session.user = user.dataValues;
		req.flash("success", "Regisztráció sikeres");
		console.log(req.session.user);/**/
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
        req.session.user = user.dataValues;
        req.flash("success", "Sikeres bejelentkezés");
		console.log(req.session.user);/**/
		res.redirect('/');
    });
});

module.exports = router;