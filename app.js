//export DATABASEURL='mongodb://localhost:27017/invoicebucket'
//export PORT='3000'
var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	cookieParser 	= require('cookie-parser'),
	methodOverride  = require("method-override"),
	session 		= require('express-session'),
	mongoose 		= require("mongoose"),
	
	indexRoutes		= require("./routes/index"),
	
	port 			= process.env.PORT,
	databaseurl		= process.env.DATABASEURL;

mongoose.set('useUnifiedTopology', true);
mongoose.connect(databaseurl, { useNewUrlParser: true });

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
        expires: 600000
    }
}));

app.use("/", indexRoutes);

app.listen(port, function(){
	console.log("InvoiceBucket server has started on port " + port + "!");
});