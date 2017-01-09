var mongoose = require('mongoose');

var customerSchema = new mongoose.Schema({
    customer_id : Number,
    email : String,
    referral_id : Number,
    payback : Number,
	isAmbassador : Boolean,
	joiningDate : Date,
	lastUpdated : Date
	
 });

module.exports = mongoose.model('CustomerModel',customerSchema);