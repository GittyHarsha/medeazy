import { Router } from 'express';
import { checkLogin } from '../middlewares/auth.js';
import Supplier from '../models/supplier.model.js';
import validator from '../middlewares/validators/supplier.js';
const router = Router();

const fields = ['name', 'contact', 'email', 'address'];
router.get('/profile', async (req, res, next) => {
  console.log("request for supplier profile , req: ", req.user);
  const ret = await Supplier.find(req.user.id);
  if (ret) {
    res.render('profile.ejs', { ret, ctype: 'supplier' });
  } else {
    next();
  }
});

router.get('/profile', (req, res) => {
  res.redirect('/supplier/profile/edit');
});

router.get('/profile/edit', checkLogin, async (req, res) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  const ret = await Supplier.find(req.user.name, 'name');
  res.render('profile.edit.ejs', { ret, ctype: 'supplier' });
});

router.post('/profile/edit', checkLogin, validator, async (req, res) => {
  const ret = {};
  for (const col of fields) {
    if (req.body[col]) {
      ret[`Supplier_${col}`] = req.body[col];
    }
  }

  if (JSON.stringify(ret) !== '{}') {
    await Supplier.save(req.user.id, ret);
  }
  req.flash('success', 'Updated successfully');
  res.redirect('/supplier/profile/edit');
});

router.get(
  '/profile/:name',
  (req, res, next) => {
    if (req.isAuthenticated() && req.user.name && req.params.name) {
      if (
        req.params.name === '' ||
        req.user.name.toLowerCase() === req.params.name.toLowerCase()
      ) {
        return res.redirect('/supplier/profile/edit');
      }
    }
    next();
  },
  async (req, res, next) => {
    const ret = await Supplier.find(req.params.name, 'name');
    if (ret) {
      res.render('profile.ejs', { ret, ctype: 'supplier' });
    } else {
      next();
    }
  }
);

export default router;
