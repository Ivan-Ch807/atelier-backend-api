import { Router } from 'express';

import { ClientController } from '../../controllers/ClientController';

const router = Router();

router.get('/', ClientController.list);
router.get('/:id', ClientController.show);
router.post('/', ClientController.create);
router.patch('/:id', ClientController.update);
router.delete('/:id', ClientController.destroy);

export default router;
