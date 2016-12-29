var mongoose = require('mongoose');
var HashMap = require('hashmap');

var referSchema = mongoose.Schema({

	customer_id:{
		type:Number,
		unique:true,
		require:true
	},
	email:{
		type:String,
		unique:true,
		require:true
	},
	referral_id:{
		type:Number,
		default:-1
	},
	payback:{
		type:Number,
		default:0
	},
	isAmbassador:{
		type:Boolean,
		default:false
	},
	joiningDate:{
		type:Date,
		default:Date.now
	},
	lastUpdated:{
		type:Date,
		default:Date.now
	}

});


//Exporting the object for outside 
var Refer = module.exports = mongoose.model('refer' , referSchema );

module.exports.getCustomerById = function(customerId,callback){
		Refer.findOne({customer_id:customerId},callback);
}

module.exports.addCustomer = function(customer,callback){
	Refer.create(customer,callback);
}

module.exports.addAmbassador = function(ambassador,callback){
	ambassador.isAmbassador=true;
	Refer.create(ambassador,callback);
}

module.exports.convertCustomerToAmbassador = function(customerId,options,callback){
	var query = {customer_id:customerId};
	var update = {
		isAmbassador:true,
		lastUpdated:new Date()
	}

	Refer.findOneAndUpdate(query,update,options,callback);	

}

module.exports.addReferral = function(customerId,referral,options,callback){
	
	referral.referral_id = customerId;
	Refer.create(referral,callback);
	console.log(referral);

	var query = {customer_id:customerId};
	var update=''

	//Getting the parent data 

	Refer.findOne({customer_id:customerId}).populate("referral_id","payback").exec(function(error, parent) {
	console.log(parent);
		//Check if parent of parent exists
		if(parent.referral_id !=-1){
			//Getting data for parent of parent
			Refer.findOne({customer_id:parent.referral_id}).populate("payback","isAmbassador").exec(function(error, parent2) {
			console.log(parent2);
			//Check if parent of parent is Ambassador and updating the payback accordingly
			if(parent2.isAmbassador){
				// console.log("inside");
				var query2 = {customer_id:parent.referral_id};
				var updateAmbassador = {
					payback: parent2.payback + 10,
					lastUpdated:new Date()
				} 
				Refer.update(query2,updateAmbassador).exec();
			}
			
			

			});
		}
		var update = {
			payback: parent.payback + 30,
			lastUpdated:new Date()
		} 
		//updating the parent payback value
		Refer.findOneAndUpdate(query,update,options,callback);

	});
}

module.exports.fetchAllCustomersWithReferralCount = function(callback){

	Refer.aggregate({ "$group": { "_id": '$referral_id', "referCount": { "$sum": 1 } } },{ "$sort": { "referCount": -1 } },callback);
}

module.exports.fetchAllChildren = function(customerId,callback){
		Refer.find({referral_id:customerId},callback);
}

// module.exports.fetchAllAmbassadorChildren = function(customerId,callback){
// 		Refer.findOne({customer_id:customerId}).populate("payback","isAmbassador").exec(function(error, parent) {
// 		// console.log(parent);
// 		if (parent.isAmbassador){
// 			console.log(parent.isAmbassador);
// 			Refer.find({referral_id:customerId},callback);
// 		}
// 		else{
// 			Refer.find({referral_id:""},callback);
// 		}

// 		});
// }


module.exports.fetchAllChild = function(customerId, callback){
	var list = [];
	var allChild = [];
	list.push(parseInt(customerId));
	fetchCh(allChild,list,0).then(function (result) {
		console.log('end result: ', result);	
		callback(null, result);	
	});
	// setTimeout(function(){},50000);
		
}
function fetchCh(allChild,list,i){

	return new Promise((res, rej) => {
		var x = Refer.find({referral_id:list.shift()}).populate("customer_id").exec((error, childs) => {
			for(var j=0;j<childs.length;j++) {	
				list.push(childs[j].customer_id);
				allChild.push(childs[j]);
				console.log(list,list.length);
			}
		}).then(function (childs) {
			if(!list.length) {
				console.log('resolving...', list);
				return res(allChild);
			} else {
				return res(fetchCh(allChild,list,i));
			}	
		})

	});


}

module.exports.fetchAllAmbassadorChildren = function(customerId, callback){
	var list = [];
	var allChild = [];
	Refer.findOne({customer_id:customerId}).populate("payback","isAmbassador").exec(function(error, parent) {
		// console.log(parent);
		if (parent.isAmbassador){
			list.push(parseInt(customerId));
			fetchCh(allChild,list,0).then(function (result) {
				console.log('end result: ', result);	
				callback(null, result);	
			});
		}
		else{
			Refer.find({customerId:""},callback);
		}

		});
}