const middlewareObj = {};

middlewareObj.authorizedUpdate = (res, id, label, body, redirect ='') => {
    label.findByIdAndUpdate(id,  body, (err) => {
        if (err) {
            console.log(`You are authorized to do that, but there was an error`, err);
        } else {
            res.redirect(`/camps/${redirect}`);
        }
    });
};

middlewareObj.authorizedDelete = (res, id, label, redirect = '') => {
    label.findByIdAndDelete(id, (err) => {
        if (err){
            res.send(`You have proper authorization, but there was an error`, err);
        } else {
            res.redirect(`/camps/${redirect}`);
        }
    });
};

middlewareObj.loginCheck = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error', 'please login');
        res.redirect('/login');
    }
};

module.exports = middlewareObj;