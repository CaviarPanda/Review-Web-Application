const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: {
        required : true,
        type: String,
        trim: true
    },
    email: {
        required : true,
        type: String,
        trim: true,
        unique: true
    },
    password: {
        required : true,
        type: String,
    }
});

//whenever we save file into db, before saving run this function
userSchema.pre('save', async function(next) {
    if(this.isModified("password")){
       const hash = await bcrypt.hash(this.password, 10); 
       this.password = hash;
    }
    next();
})
module.exports = mongoose.model("User", userSchema,);