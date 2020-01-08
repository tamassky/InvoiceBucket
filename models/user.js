var mongoose = require("mongoose");

var userSchema = new.mongoose.Schema({
	emailAddress: String,
	password: String,
	navUsername: String,
	navPassword: String,
	signingToken: String,
	exchangeToken: String,
	taxNumber: String,
	displayName: String,
	legalEntityName: String,
	emailConfirmed: Boolean,
	creationDate: Date,
	lastUpdateDate: Date
});

module.exports = mongoose.model("User", userSchema);