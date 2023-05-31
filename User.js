const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = 'thisIsOurLittleSecret';

userSchema.plugin(encrypt, {secret:secret, encryptedFields: ['password']});

module.exports= mongoose.model('User', userSchema);

