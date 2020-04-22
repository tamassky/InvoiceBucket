var express 			= require("express"),
	app 				= express(),
	bodyParser 			= require("body-parser"),
	cookieParser 		= require('cookie-parser'),
	methodOverride  	= require("method-override"),
	session 			= require('express-session'),
	mongoose 			= require("mongoose"),
	flash				= require("connect-flash"),
	
	User 				= require("./models/user"),
	
	indexRoutes			= require("./routes/index"),
	
	port 				= process.env.PORT,
	databaseurl			= process.env.DATABASEURL;

mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(databaseurl, { useNewUrlParser: true, useFindAndModify: false});

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session({
    key: 'user_sid',
    secret: 'numberplateIsDropTable*',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 1800000
    }
}));

app.use(flash());

app.use(function(req, res, next){
	//res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");	
	next();
});

app.use("/", indexRoutes);

app.listen(port, function(){
	console.log("InvoiceBucket server has started on port " + port + "!");
});