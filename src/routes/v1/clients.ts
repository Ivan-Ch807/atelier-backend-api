import { Router } from 'express';

import { ClientController } from '../../controllers/ClientController';
import { validatorCreateClient } from '../../middleware/validation/clients/validatorCreateClient';

const router = Router();

router.get('/', ClientController.list);
router.get('/:id', ClientController.show);
router.post('/', [validatorCreateClient], ClientController.create);
router.patch('/:id', ClientController.update);
router.delete('/:id', ClientController.destroy);

export default router;
