const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/forecast', weatherController.getWeatherForecast);
router.get('/alerts', weatherController.getWeatherAlerts);

module.exports = router;
