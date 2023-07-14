import { checkLogin } from '../middlewares/auth.js';
import User from '../models/user.model.js';
import Retailer from '../models/retailer.model.js';
import Supplier from '../models/supplier.model.js';
const forgotControllerPOST = async (req, res) => {
  const { rid } = req.body;
  const { answer } = req.body;
  const { password } = req.body;
  const yes = await User.verifyAnswer(rid, answer, 'retailer');
  if (!yes) {
    req.flash('error', 'Invalid answer');
    res.redirect('/auth/login#forgot');
  } else {
    await User.changePassword(password, rid, 'retailer');
    req.flash('success', 'Password changed successfully');
    res.redirect('/auth/login');
  }
};

const forgotControllerGET = async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
    return;
  }
  const arr = await User.findHintQ(req.query.username, 'retailer');
  if (arr) {
    [res.locals.hintq, res.locals.rid] = arr;
    res.render('forgot');
    return;
  }
  req.flash('error', 'Invalid username');
  res.redirect('/auth/login#forgot');
};

const changePasswordGET = [
  checkLogin,
  (req, res) => {
    if (req.user && req.user.rid) {
      res.locals.rid = req.user.rid;
      res.locals.error = req.flash('error');
      res.render('changePass.ejs');
    } else {
      req.flash('error', 'Please login to continue');
      req.flash('redirect', req.url);
      res.redirect('/auth/login');
    }
  }
];

const changePasswordPOST = async (req, res, next) => {
  const { old } = req.body;
  const { password } = req.body;
  const { rid } = req.body;
  if (rid !== req.user.rid) {
    return next({ code: 400, desc: 'Bad request', content: 'rid malformed' });
  }
  const yes = await User.verifyById(old, rid, 'retailer');
  if (!yes) {
    req.flash('Old password incorrect');
    res.redirect('/auth/change');
    return;
  }
  await User.changePassword(password, rid, 'retailer');
  req.flash('success', 'Password changed successfully');
  res.redirect('/profile/edit');
};
/* 
CREATE TABLE IF NOT EXISTS Retailers (
	Retailer_id varchar(10) PRIMARY KEY,
	Retailer_name varchar(30),
	Retailer_contact varchar(10),
	Retailer_email varchar(50),
	Retailer_address varchar(80)
);
CREATE TABLE IF NOT EXISTS Suppliers (
	Supplier_id varchar(10) PRIMARY KEY,
	Supplier_name varchar(30),
	Supplier_contact varchar(10),
	Supplier_email varchar(50),
	Supplier_address varchar(80)
);

// added supplier column

CREATE TABLE IF NOT EXISTS User_Accounts (
	User_id int PRIMARY KEY AUTO_INCREMENT NOT NULL,
	Password_hash binary(60),
	Hint_question varchar(50),
	Answer varchar(30),
	Retailer_id varchar(10),
	Supplier_id varchar(10),
	FOREIGN KEY (Retailer_id)
	REFERENCES Retailers(Retailer_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	
	FOREIGN KEY (Supplier_id)
	REFERENCES Suppliers(Supplier_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);*/
const registerController = async (req, res) => {
  console.log(req.body);


  const ret = {
    'Retailer_name': req.body.name,
    'Retailer_contact': req.body.contact,
    'Retailer_email': req.body.email,
    'Retailer_address': req.body.address
  };
  const rid = await Retailer.add(ret);
  const user = {
    'password': req.body.password,
    'Hint_question': req.body.hintq,
    'Answer': req.body.answer,
    'Retailer_id': rid
  };
  
  await User.add(user, 'retailer');
  req.flash('success', 'Registered successfully. Please login to continue');
  res.redirect('/retailer/auth/login');
  
 
  
};

const hintControllerPOST = async (req, res) => {
  const obj = {
    'Hint_question': req.body.hintq,
    'Answer': req.body.answer
  };
  await User.saveHintq(req.user.rid, obj, 'retailer');
  req.flash('success', 'Hint question changed successfully');
  res.redirect('/profile/edit');
};

const deleteControllerPOST = async (req, res) => {
  const result = await User.verifyById(req.body.old, req.user.rid, 'retailer');
  if (result) {
    await Retailer.del(req.user.rid);
    req.flash('success', 'Account deleted successfully');
    res.redirect('/auth/logout');
  } else {
    req.flash('error', 'Invalid password');
    res.redirect('/auth/delete');
  }
};

export {
  forgotControllerGET,
  forgotControllerPOST,
  changePasswordGET,
  changePasswordPOST,
  registerController,
  hintControllerPOST,
  deleteControllerPOST
};
