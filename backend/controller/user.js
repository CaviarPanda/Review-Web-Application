//req is info coming from our front end 
//res is info we giving as a response 
exports.create = (req,res) => {
    console.log(req.body);
    res.json({user: req.body});
};
