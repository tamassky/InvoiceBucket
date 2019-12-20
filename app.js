var express 		= require("express"),
	app 			= express();

var indexRoutes		= require("./routes/index");

app.set("view engine", "ejs");

app.use("/", indexRoutes);

app.listen(process.env.PORT || 3000, function(){
	console.log("InvoiceBucket server has started!");
});