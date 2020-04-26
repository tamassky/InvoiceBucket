var mongoose = require("mongoose");

var taxpayerSchema = new mongoose.Schema({
	taxNumber: String,
	name: String,
	postalCode: String,
	city: String,
	additionalAddressDetail: String,
	creationDate: Date,
	lastUpdateDate: Date
});

module.exports = mongoose.model("Taxpayer", taxpayerSchema);