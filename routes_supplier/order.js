import { Router } from 'express';
import { checkLogin } from '../middlewares/auth.js';
import Order from '../models/order.model.js';
import Supplier from '../models/supplier.model.js';
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
    for (const sup of suppliers) {
      supmap.set(sup['Supplier_id'], sup['Supplier_name']);
    }
    res.render('order.ejs', { pending, completed, cancelled, supmap , ctype: 'supplier'});
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
      res.render('order.edit.ejs', { order, suppliers, ctype: 'supplier' });
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
    res.redirect('/supplier/orders/');
  }
);

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
  res.render('order.add.ejs', {suppliers: suppliers, ctype: 'supplier' });
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
  
  
  res.redirect('/supplier/orders');
});

router.post('/orders/finish', checkLogin, async (req, res, next) => {
  const order = await Order.find(req.user.id, req.query.id);
  if (order) {
    await Order.finish(req.user.id, req.query.id);
    req.flash('success', 'order completed and added to inventory successfully');
    res.redirect('/supplier/orders/');
  } else {
    next();
  }
});

router.post('/orders/cancel', checkLogin, async (req, res, next) => {
  const order = await Order.find(req.user.id, req.query.id);
  if (order) {
    await Order.cancel(req.user.id, req.query.id);
    req.flash('success', 'order cancelled');
    res.redirect('/supplier/orders/');
  } else {
    next();
  }
});












export default router;
