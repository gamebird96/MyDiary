var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

let User = new Schema(
{
	uname:
	{
		type: String
	},
	pass:
	{
		type: String
	},
	phone:
	{
		type: String
	},
	gender: 
	{
		type: String
	},
	salt:
	{
		type: String
	}
});

User.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  this.pass = hash;
};

User.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.pass === hash;
};

User.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    //email: this.email,
    uname: this.uname,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};


const user = module.exports = mongoose.model('User', User);