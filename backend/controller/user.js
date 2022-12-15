//req is info coming from our front end eg json, images, etx
//res is info we giving as a response to front end
const User = require('../models/user');

exports.create = async (req,res) => {
    console.log(req.body);
    const {name, email, password} = req.body;
    const oldUser = await User.findOne({email});
    if(oldUser){
        return res.status(401).json({error: 'This email address is already being used'});
    }
    const newUser = new User({name, email, password});
    await newUser.save();

    res.status(201).json({user: newUser});
};
