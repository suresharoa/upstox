var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json())

Refer = require('./models/refer')

//Connecting to mongoose

var connection = mongoose.connect('mongodb://localhost/referral');
var db = mongoose.connection;

app.use(function(req, res, next) {
    var auth;

    // check whether an autorization header was send    
    if (req.headers.authorization) {
      // only accepting basic auth
      auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
    }

    // checks if:
    // auth array exists 
    if (!auth || auth[0] !== 'testuser' || auth[1] !== 'testpassword') {
        // any of the tests failed
        // send an Basic Auth request (HTTP Code: 401 Unauthorized)
        res.statusCode = 401;
        // MyRealmName can be changed to anything, will be prompted to the user
        res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
        // this will displayed in the browser when authorization is cancelled
        res.end('Unauthorized');
    } else {
        // continue with processing, user was authenticated
        next();
    }
});

app.get('/',function (req,res) {
	res.send('Please use or /api/');
});


app.get('/api/getCustomerById/:customer_id',function(req,res){
		Refer.getCustomerById(req.params.customer_id,function(err,data){
			if(err){
				res.json({"status":"error"});
				throw err;
			}
			res.json(data);
		});
});

app.post('/api/addCustomer',function(req,res){
		var customer = req.body;
		// console.log(customer);
		Refer.addCustomer(customer,function(err,data){
			if(err){
				res.json({"status":"error"});
				throw err;
			}
			res.json({"status":"ok"});
			// console.log('Customer added ...')
		});
});

app.post('/api/addAmbassador',function(req,res){
		var ambassador = req.body;
		// console.log(ambassador);
		Refer.addAmbassador(ambassador,function(err,data){
			if(err){
				res.json({"status":"error"});
				throw err;
			}
			res.json({"status":"ok"});
			// console.log('Ambassador added ...')
		});
});

app.put('/api/convertCustomerToAmbassador/:customer_id',function(req,res){
		
		var customer_id = req.params.customer_id;
		Refer.convertCustomerToAmbassador(customer_id,function(err,data){
			if(err){
				throw err;
			}
			res.json({"status":"ok"});
			// console.log('Conveted to ambassador ...')
		});
});

app.put('/api/addReferral/:customer_id',function(req,res){
		var referral = req.body;
		// console.log(referral);
		Refer.addReferral(req.params.customer_id,referral,function(err,data){
			if(err){
				res.json({"status":"error"});
				throw err;
			}
			res.json({"status":"ok","parent_id":req.params.customer_id});
			// console.log('Referral added ...')
		});
});

app.get('/api/fetchAllCustomersWithReferralCount',function(req,res){
		Refer.fetchAllCustomersWithReferralCount(function(err,data){
			if(err){
				res.json({"status":"error"});
				throw err;
			}
			res.json(data);
		});
});

app.get('/api/fetchAllChildren/:customer_id',function(req,res){
		Refer.fetchAllChildren(req.params.customer_id,function(err,data){
			if(err){
				res.json({"status":"error"});
				throw err;
			}
			res.json(data);
		});
});

app.get('/api/fetchAllAmbassadorChildren/:customer_id',function(req,res){
		Refer.fetchAllAmbassadorChildren(req.params.customer_id,function(err,data){
			if(err){
				res.json({"status":"error"});
				throw err;
			}
			res.json(data);
		});
});

app.get('/api/fetchAllChild/:customer_id', function(req,res){
		Refer.fetchAllChild(req.params.customer_id, function(err,data) {
			if(err){
				res.json({"status":"error"});
				throw err;
			}
			res.json(data);
		});
});

app.get('/api/fetchAllAmbassadorChildren/:customer_id', function(req,res){
		Refer.fetchAllChild(req.params.customer_id, function(err,data) {
			if(err){
				res.json({"status":"error"});
				throw err;
			}
			res.json(data);
		});
});

app.listen(8081);
console.log('Running the app ...')