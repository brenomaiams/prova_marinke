import express from 'express';
import ProfileController from '../controllers/ProfileController';
import JobController from '../controllers/JobController';
import ContractController from '../controllers/ContractController';
const router = express.Router();
const profileController = new ProfileController();
const jobController = new JobController();
const contractController = new ContractController();
router.get('/profiles/:id/balance', profileController.getBalance);
router.get('/profiles/unpaid-jobs', profileController.getUnpaidJobs);
router.post('/profiles/:id/deposit', profileController.deposit);
router.get('/profiles/:id/jobs', jobController.getJobs);
router.post('/profiles', profileController.createProfile);
router.get('/contracts/:id/jobs', contractController.getJobs);
export default router;
