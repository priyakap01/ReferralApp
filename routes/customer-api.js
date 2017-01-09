
var express = require('express');
var router  = express.Router();//provide the routing functionality in Express
var mongoose = require('mongoose');

//Model
var CustomerModel = require('../models/customer-schema');

//API-----------------------------------------------------------

//For fetching a customer details by ID
router.get('/getCustomerById/:id',function (req, res) {
  CustomerModel.find({'customer_id' : req.params.id}, function(err, docs){
    if (err) return next(err);
    res.json(docs);   
  });
});

//Fetch All Children Under A Customer
router.get('/fetchAllChildren/:id',function (req, res) {
  CustomerModel.find({'referral_id' : req.params.id}, function(err, docs){
    if (err) return next(err);
    res.json(docs);   
  });
});

//Fetch All Children of an Ambassador
router.get('/fetchAllAmbassadorChildren/:id',function (req, res) {
	CustomerModel.find({'isAmbassador':true},function(){
		CustomerModel.find({'referral_id' :req.params.id},function(err,docs){
			if (err) return next(err);
			res.json(docs); 
		});
	})
});


//For Adding A new Customer
router.post('/addCustomer',function(req, res,next){
  CustomerModel.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

//For Adding A Referral Under A Customer
router.post('/addReferral/:id',function(req, res,next){
	CustomerModel.update({'customer_id': req.params.id},{ $inc: { 'payback': 10}},{ $currentDate: {'lastUpdated': true}},function(){
		CustomerModel.create(req.body, function (er, data) {
			if (er) return next(er);
			res.json(data);
		});
	});
});

//For Adding A new ambassador
router.post('/addAmbassador',function(req, res,next){
  req.body.isAmbassador = true;
  CustomerModel.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


//convert customer to ambassador
router.put('/convertCustomerToAmbassador/:id',function(req, res, next) {
	CustomerModel.update({'customer_id':req.params.id},{$set:{'isAmbassador':true}}, function (err, post) {
		if (err) return next(err);
		res.json(post);
	});
});

//Fetch all the customers with referral count in descending count
router.get('/fetchAllCustomersWithReferralCount',function(req,res){
	CustomerModel.aggregate([{$group:{_id :'$referral_id', count: { $sum: 1}}},{$sort:{"count":-1}}],function(err,post){
		if(err) return next(err);
		res.json(post);
	});
	
});

//Fetch all children at nth level)
router.get('/fetchChildrenAtNthLEvel/:id1/:id2',function(req,res){
	var n= req.params.id2;
	var allChildren =[];
	CustomerModel.find({'referral_id' : req.params.id1}, function(err, docs){
		if (err) return next(err);
		while(n>1){
			for(i in docs){
				CustomerModel.find({'referral_id':docs[i].customer_id},function(er,post){
					if(er) return next(er);
					allChildren.push.apply(allChildren,post);
				});				
			}
			docs = allChildren;
			n--;
		}
	});
	res.json(docs);	
});


module.exports = router; //exporting the routes to make them available in other files 