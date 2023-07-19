import passport from 'passport';

import User from '../models/user.model.js';
//import Retailer from '../models/retailer.model.js';
//import Suppler from '../models/supplier.model.js';



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
import googleStrategy from 'passport-google-oauth20';
//const googleStrategy=google_strategy.OAuth2Strategy;

console.log(googleStrategy);
import crypto from 'crypto';
import { access } from 'fs';




//retailer client id: 999072149657-788pqg4af4h0sqe8nulgs1bke24uq907.apps.googleusercontent.com
//supplie client id:  999072149657-7iensdghjtnm61e33nmrcgt7b7c104q6.apps.googleusercontent.com



passport.use('retailerStrategy',new googleStrategy(
  {
  clientID: '999072149657-788pqg4af4h0sqe8nulgs1bke24uq907.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:8080/retailer/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {

      //const email=profile._json.email;
      //const rid=Retailer.find_email(email);

      done(null, profile);
  }
));
passport.use('supplierStrategy', new googleStrategy(
  {
  clientID: '999072149657-7iensdghjtnm61e33nmrcgt7b7c104q6.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:8080/supplier/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
      const user={
          email: accessToken.email,
          name: accessToken.name
      };
      done(null, user);
  }
));

export default passport;
