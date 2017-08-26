const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();


router.get('/admin', (req, res) => {
  res.render('admin',{layout: 'dashboard'});
});

router.get('/customer', (req, res) => {

});
router.get('/try', (req, res) => {
  res.send('Try successful')
});

module.exports = router;
