var express  = require("express");
var router 	 = express.Router();

//show landing page
router.get("/", function(req, res){
	res.render("landing");
});

//show registration page
router.get("/register", function(req, res){
	res.render("register");
});

module.exports = router;