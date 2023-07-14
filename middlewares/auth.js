import { encode } from 'querystring';

const checkLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    console.log("user not authenticated");
    req.flash('error', 'Please login to continue');
    req.flash('redirect', encode({ url:req.url }));
    res.redirect('/auth/login');
  }
};

export {
  checkLogin,
};
