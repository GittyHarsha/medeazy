import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/user.model.js';



import passportCustom from 'passport-custom';
const CustomStrategy = passportCustom.Strategy;

passport.use('custom', new CustomStrategy(
  
  function(req, done) {
    console.log("inside custom strategy");
    var username=req.body.username;
    var password=req.body.password;
    var customer_type=req.body.customer_type;
    console.log("customer type: ", customer_type);
    User.verifyPassword(username, password, customer_type).then(user => {
      if (!user) {
        console.log("invalid username or password");
        return done(null, false, { message: 'Invalid username or password' });
      }
      console.log("user after passport authentication", user);
      return done(null, user);
    })
      .catch(error => done(error));
  }
));
/*
passport.use(new LocalStrategy(
  {
  usernameField: 'username',
  passwordField: 'password',
  customer_type: 'customer_type',
  verify: (username, password, customer_type, done) => {
    User.verifyPassword(username, password, customer_type).then(user => {
      if (!user) {
        return done(null, false, { message: 'Invalid username or password' });
      }
      console.log("user after passport authentication", user);
      return done(null, user);
    })
      .catch(error => done(error));
    },
  }
));


*/
passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

export default passport;
