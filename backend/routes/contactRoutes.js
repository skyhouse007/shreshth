import { Router } from 'express';
import {
  createContact,
  listContacts,
  updateContact,
  deleteContact,
} from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', createContact);
router.get('/', protect, listContacts);
router.patch('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);

export default router;
