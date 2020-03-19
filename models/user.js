var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	username: { type: String, unique: true},
	password: String,
	navUsername: String,
	navPassword: String,
	xmlsign: String,
	xmlexchange: String,
	taxNumber: String,
	taxpayerName: String,
	creationDate: Date,
	lastUpdateDate: Date
});

module.exports = mongoose.model("User", userSchema);