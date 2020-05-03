var express 			= require("express"),
	app 				= express(),
	bodyParser 			= require("body-parser"),
	methodOverride		= require("method-override"),
	session 			= require('express-session'),
	mongoose 			= require("mongoose"),
	flash				= require("connect-flash"),
	methodOverride  	= require("method-override"),
	
	User 				= require("./models/user"),
	Transaction 		= require("./models/transaction"),
	Line 				= require("./models/line"),
	
	indexRoutes			= require("./routes/index"),
	transactionRoutes	= require("./routes/transaction"),
	lineRoutes			= require("./routes/line"),
	
	port 				= process.env.PORT,
	databaseurl			= process.env.DATABASEURL;

mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(databaseurl, { useNewUrlParser: true, useFindAndModify: false});

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: 'user_sid',
    secret: 'numberplateIsDropTable*',
    resave: false,
    saveUninitialized: false,
	rolling:true,
    cookie: {
        expires: 1800000,
		maxAge: 1800000
    }
}));

app.use(flash());

app.use(methodOverride("_method"));

app.use(function(req, res, next){
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");	
	next();
});

app.use("/", indexRoutes);
app.use("/transaction", transactionRoutes);
app.use("/transaction/:number/line", lineRoutes);

app.listen(port, function(){
	console.log("InvoiceBucket server has started on port " + port + "!");
});