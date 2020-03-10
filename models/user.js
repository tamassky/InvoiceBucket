var mongoose = require("mongoose");

var userSchema = new.mongoose.Schema({
	username: String,
	password: String,
	navUsername: String,
	navPassword: String,
	xmlsign: String,
	xmlexchange: String,
	taxNumber: String,
	displayName: String,
	taxpayerName: String,
	creationDate: Date,
	lastUpdateDate: Date
});

module.exports = mongoose.model("User", userSchema);