const express = require('express');
const { getSigendURL } = require('../controllers/aws-controller');
const Authentication = require('../middleware/Authentication');

const router = express.Router();

router.get('/signed', getSigendURL);

module.exports = router;
