import { Router } from 'express';
import { getSiteProjectBySlugPublic, listSiteProjectsPublic } from '../controllers/siteProjectController.js';

const router = Router();

router.get('/', listSiteProjectsPublic);
router.get('/:slug', getSiteProjectBySlugPublic);

export default router;
