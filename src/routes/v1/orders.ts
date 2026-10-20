import { Router } from 'express';

import { OrderController } from '../../controllers/OrderController';
import { validatorCreateOrder } from '../../middleware/validation/orders/validatorCreateOrder';

const router = Router();

router.get('/', OrderController.list);
router.get('/:id', OrderController.show);
router.post('/', [validatorCreateOrder], OrderController.create);
router.patch('/:id', OrderController.update);
router.delete('/:id', OrderController.destroy);

export default router;
