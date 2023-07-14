import { Router } from 'express';
import auth from './auth.js';
import Protected from './protected.js';
import profile from './profile.js';
import staff from './staff.js';
import supplier from './supplier.js';
import inventory from './inventory.js';
import order from './order.js';
import retailer from './retailer.js';
const router = Router();

router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});
router.use('/supplier', auth);
router.use('/supplier', protectd);
router.use('/supplier', profile);
router.use('/supplier', staff);
router.use('/supplier', supplier);
router.use('/supplier', inventory);
router.use('/supplier', order);
router.use('/supplier', retailer);
router.get('/500', (req, res, next) => {
  next({ code: 500, desc: 'Internal server error' });
});

export default router;
