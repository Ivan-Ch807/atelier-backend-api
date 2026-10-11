import { Router } from 'express';

import { OrderController } from '../../controllers/OrderController';

const router = Router();

router.get('/', OrderController.list);
router.get('/:id', OrderController.show);
router.post('/', OrderController.create);
router.patch('/:id', OrderController.update);
router.delete('/:id', OrderController.destroy);

export default router;
