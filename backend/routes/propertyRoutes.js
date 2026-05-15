import { Router } from 'express';
import {
  getProperties,
  getPropertiesByIds,
  getPropertyBySlug,
  getPropertyByIdAdmin,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import { protect } from '../middleware/auth.js';
import { uploadPropertyImages } from '../middleware/upload.js';

const router = Router();

router.get('/', getProperties);
router.get('/by-ids', getPropertiesByIds);
router.get('/slug/:slug', getPropertyBySlug);
router.get('/admin/:id', protect, getPropertyByIdAdmin);
router.post('/', protect, uploadPropertyImages.array('images', 12), createProperty);
router.put('/:id', protect, uploadPropertyImages.array('images', 12), updateProperty);
router.delete('/:id', protect, deleteProperty);

export default router;
