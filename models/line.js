var mongoose = require("mongoose");

var lineSchema = new mongoose.Schema({
	lineDescription: String,
	unitOfMeasure: String,
	unitOfMeasureOwn: String,
	quantity: String,
	unitPrice: String,
	lineGrossAmountSimplified: String,
});

module.exports = mongoose.model("Line", lineSchema);