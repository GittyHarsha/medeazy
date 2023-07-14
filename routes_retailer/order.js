import { Router } from 'express';
import { checkLogin } from '../middlewares/auth.js';
import Order from '../models/order.model.js';
import Supplier from '../models/supplier.model.js';
import supplier_inventory from '../models/supplier_inventory.model.js';
import validator from '../middlewares/validators/order.js';
import db from '../models/db.js';
import nodemailer from 'nodemailer';
const router = Router();


// Create a new transporter object.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: false,
  auth: {
    user: 'hnarayana788@gmail.com',
    password: '..,,??np',
  },
});

router.get(
  '/orders/',
  checkLogin,
  async (req, res) => {
    const pending = await Order.pending(req.user.id);
    const completed = await Order.completed(req.user.id);
    const cancelled = await Order.cancelled(req.user.id);
    const suppliers = await Supplier.findAll(req.user.id);
    const supmap = new Map();
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    console.log("displaying suppliers of retailer with id: ", req.user.id);
    for (const sup of suppliers) {
      console.log(sup);
      supmap.set(sup['Supplier_id'], sup['Supplier_name']);
    }
    console.log("suppliers: ");
    console.log(supmap);
    res.render('order.ejs', { pending, completed, cancelled, supmap , ctype: 'retailer'});
  }
);

router.get(
  '/orders/edit',
  checkLogin,
  async (req, res, next) => {
    const order = await Order.find(req.user.id, req.query.id);
    if (order) {
      res.locals.error = req.flash('error');
      const suppliers = await Supplier.findAll(req.user.id);
      res.render('order.edit.ejs', { order, suppliers, ctype: 'retailer' });
    } else {
      next();
    }
  }
);

router.post(
  '/orders/edit',
  checkLogin,
  validator,
  async (req, res, next) => {
    if (req.query.id !== req.body.id) {
      return next({
        code: 400,
        desc: 'Bad request',
        content: 'order id malformed'
      });
    }
    const order = {
      'Retailer_id': req.user.id,
      'Supplier_id': req.body.supplier,
      'Medicine_name': req.body.name,
      'Quantity': req.body.quantity,
      'MRP': req.body.mrp,
      'Order_date': req.body.ordate
    };
    await Order.save(req.user.id, req.query.id, order);
    req.flash('success', 'Edit successful');
    res.redirect('/retailer/orders/');
  }
);

router.post('/orders/add/select', checkLogin, async (req, res)=>{
  console.log("inside req.body", req.body);
  var id=req.body.supplier_id;
  console.log("incoming supplier id: ", id);
  const medicines= await supplier_inventory.findAll(id);
    console.log("retrieved medicines: ", medicines);
    res.render('selected_supplier.ejs', {medicines: medicines, ctype: 'retailer' , supplier_id: id});

});
/* 
CREATE TABLE IF NOT EXISTS Transactions (
	transaction_no int PRIMARY KEY,
	Retailer_id varchar(10),
	Supplier_id varchar(10),
	start_date date,
	end_date date,
	Order_status enum("COMPLETED","PENDING","CANCELLED"),
	FOREIGN KEY (Supplier_id)
	REFERENCES Suppliers(Supplier_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	FOREIGN KEY (Retailer_id)
	REFERENCES Retailers(Retailer_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

*/
router.post('/orders/addtocart', checkLogin, async (req, res)=>{
  console.log("inside req.body", req.body);
  
  const transaction = {
    'Supplier_id': req.body.supplier_id,
    'Retailer_id': req.user.id,
     'start_date': new Date(),
  };
  await transaction.add(transaction, req.body);
  console.log("added transaction successfully");
  console.log(transaction);

  res.redirect('/retailer/staffs');
  res.send('<h1>items added to cart successfully</h1>');

});
router.get('/orders/add', checkLogin, async (req, res) => {
  const fields = [
    'supplier',
    'name',
    'quantity',
    'mrp',
    'ordate'
  ];
  for (const col of fields) {
    [res.locals[col]] = req.flash(col);
  }
  res.locals.error = req.flash('error');
  const suppliers = await Supplier.findAll(req.user.id);
  console.log("displaying suppliers of retailer with id: ", req.user.id);
  console.log(suppliers);
  res.render('order.add.ejs', {suppliers: suppliers, ctype: 'retailer' });
});

router.post('/orders/add', checkLogin, validator, async (req, res) => {
  const order = {
    'Retailer_id': req.user.id,
    'Supplier_id': req.body.supplier,
    'Medicine_name': req.body.name,
    'Quantity': req.body.quantity,
    'MRP': req.body.mrp,
    'Order_date': req.body.ordate,
  };
  await Order.add(order);
  const sql = 'SELECT Retailer_email FROM Retailers WHERE Retailer_id = ?';
  try {
    const [[row]] = await db.query(sql, [req.user.id]);
    console.log(row);
    const mailOptions = {
      from: row.Retailer_email,
      to: 'hnarayana788@gmail.com',
      subject: 'Orders',
      text: `
      Dear Supplier,
    
      Please find attached the list of orders that we would like to place.
    
      Thank you,
    
      ${req.body.supplier}
      `,
    };
    
    // Send the email.
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  } catch (error) {
    return Promise.reject(error);
  }
  
  
  res.redirect('/retailer/orders');
});

router.post('/orders/finish', checkLogin, async (req, res, next) => {
  const order = await Order.find(req.user.id, req.query.id);
  if (order) {
    await Order.finish(req.user.id, req.query.id);
    req.flash('success', 'order completed and added to inventory successfully');
    res.redirect('/retailer/orders/');
  } else {
    next();
  }
});

router.post('/orders/cancel', checkLogin, async (req, res, next) => {
  const order = await Order.find(req.user.id, req.query.id);
  if (order) {
    await Order.cancel(req.user.id, req.query.id);
    req.flash('success', 'order cancelled');
    res.redirect('/retailer/orders/');
  } else {
    next();
  }
});












export default router;
