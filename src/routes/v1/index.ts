import { Router } from 'express';

import auth from './auth';
import clients from './clients';
import orders from './orders';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/clients', clients);
router.use('/orders', orders);

export default router;
