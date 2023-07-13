import { Router } from 'express';
import auth from './auth.js';
import protectd_m from './protected.js';
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
router.use("/retailer", auth);
router.use("/retailer", protected_m);
router.use("/retailer", profile);
router.use("/retailer", staff);
router.use("/retailer", supplier);
router.use("/retailer", inventory);
router.use("/retailer", order);
router.use("/retailer", retailer);
router.get('/500', (req, res, next) => {
  next({ code: 500, desc: 'Internal server error' });
});

export default router;
