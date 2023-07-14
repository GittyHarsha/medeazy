import { Router } from 'express';
import { checkLogin } from '../middlewares/auth.js';
import Inventory from '../models/supplier_inventory.model.js';
import validator from '../middlewares/validators/inventory.js';
const router = Router();
const params = ['name', 'mrp', 'stock', 'batch_no', 'expiry_date'];
router.get(
  '/inventory/',
  checkLogin,
  async (req, res) => {
    const medicines = await Inventory.findAll(req.user.id);
    console.log(medicines);
    res.render('inventory.ejs', {medicines: medicines, ctype: 'supplier' });
  }
);

router.get(
  '/inventory/edit',
  checkLogin,
  async (req, res, next) => {
    const med = await Inventory.find(req.user.id, req.query.name);
    if (med) {
      res.locals.error = req.flash('error');
      res.render('inventory.edit.ejs', {med: med, ctype: 'supplier'});
    } else {
      next();
    }
  }
);

router.post(
  '/inventory/edit',
  checkLogin,
  validator,
  async (req, res) => {
    const med = {};
    if (req.body.mrp) {
      med.MRP = req.body.mrp;
    }
    if (req.body.stock) {
      med.Stock = req.body.stock;
    }
    if (req.body.name) {
      med['Medicine_name'] = req.body.name;
    }
    if(req.body.batch_no) {
      med['batch_no']=req.body.batch_no;
    }
    if(req.body.expiry_date) {
      med['expiry_date']=req.body.expiry_date;
    }
    if (JSON.stringify(med) !== '{}') {
      await Inventory.save(req.user.id, req.query.name, med);
    }
    res.redirect('/supplier/inventory');
  }
);

router.get(
  '/inventory/delete',
  checkLogin,
  async (req, res) => {
    await Inventory.del(req.user.id, req.query.name);
    res.redirect('/supplier/inventory');
  }
);

router.get(
  '/inventory/add',
  checkLogin,
  (req, res) => {
    res.locals.error = req.flash('error');
    for (const param of params) {
      [res.locals[param]] = req.flash(param);
    }
    res.render('inventory.add.ejs', {ctype: 'supplier'});
  }
);

router.post(
  '/inventory/add',
  checkLogin,
  validator,
  async (req, res) => {
    const med = {
      'Supplier_id': req.user.id,
      'Medicine_name': req.body.name,
      'MRP': req.body.mrp,
      'Stock': req.body.stock,
      "batch_no": req.body.batch_no,
      'expiry_date': req.body.expiry_date
    };
    await Inventory.add(med);
    res.redirect('/supplier/inventory');
  }
);

export default router;
