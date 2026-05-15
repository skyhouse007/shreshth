import { Router } from 'express';
import {
  createLead,
  listLeads,
  getLead,
  updateLead,
  deleteLead,
} from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', createLead);
router.get('/', protect, listLeads);
router.get('/:id', protect, getLead);
router.patch('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);

export default router;
