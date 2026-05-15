import { Router } from 'express';
import { registerAdmin, loginAdmin, getMe, updateMe } from '../controllers/adminController.js';
import {
  getSiteSettingsAdmin,
  updateAnnouncementsAdmin,
  updateHeroSlidesAdmin,
  uploadHeroSlideAdmin,
} from '../controllers/siteSettingsController.js';
import {
  listSiteProjectsAdmin,
  getSiteProjectAdmin,
  createSiteProjectAdmin,
  updateSiteProjectAdmin,
  deleteSiteProjectAdmin,
  uploadSiteProjectImageAdmin,
} from '../controllers/siteProjectController.js';
import { uploadHeroSlideImage, uploadSiteProjectImage } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);
router.get('/site-settings', protect, getSiteSettingsAdmin);
router.put('/site-settings/announcements', protect, updateAnnouncementsAdmin);
router.put('/site-settings/hero-slides', protect, updateHeroSlidesAdmin);
router.post(
  '/site-settings/hero-slides/upload',
  protect,
  uploadHeroSlideImage.single('image'),
  uploadHeroSlideAdmin
);

router.post(
  '/site-projects/upload',
  protect,
  uploadSiteProjectImage.single('image'),
  uploadSiteProjectImageAdmin
);
router.get('/site-projects', protect, listSiteProjectsAdmin);
router.post('/site-projects', protect, createSiteProjectAdmin);
router.get('/site-projects/:id', protect, getSiteProjectAdmin);
router.put('/site-projects/:id', protect, updateSiteProjectAdmin);
router.delete('/site-projects/:id', protect, deleteSiteProjectAdmin);

export default router;
