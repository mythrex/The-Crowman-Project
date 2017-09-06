const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Counters = require('../db.js').Counters;
const Banks = require('../db.js').Banks;
var recentAlert = {type: null,message: null};


router.get('/admin/counters', (req, res) => {
  let id = req.query.id;
  let counterName = req.query.counterName;
  let counterDescription = req.query.counterDescription;
  let bankId = req.query.bankId;
  Counters.findAll({
    include: [Banks],
    where: req.query
  }).then((counters) => {
    if (counters.length) {
      res.statusCode = 200;
      res.send(counters);
    }else {
      res.statusCode = 404;
      res.send('Nothing found!')
    }
    }).catch((err) => {
      throw err;
    });
});

router.get('/admin/counters/:id', (req, res) => {
  Counters.find({
    where: {
      id: req.params.id
    },
    include: [Banks]
  }).then((counter) => {
      if (counter) {
        res.statusCode = 200;
        res.send(counter);
      }else {
        res.statusCode = 404;
        res.send('Nothing found!')
      }
    }).catch((err) => {
      throw err;
    });
});

router.post('/admin/counters', (req, res) => {
  console.log(req.body);
  Counters.create({
    counterName: req.body.counterName,
    counterDescription: req.body.counterDescription,
    bankId: 1
  }).then((result) => {
    res.statusCode = 200,
    res.send(result)
  }).catch((err) => {
    throw err;
  })
});

router.delete('/admin/counters/:id', (req, res) => {
  Counters.destroy({
    where: {
      id: req.params.id
    }
  }).then((result) => {
    if (result) {
      res.statusCode = 200,
      res.send('Successfully Deleted')
    } else {
      res.statusCode = 404;
      res.send('Nothing found!')
    }
  }).catch((err) => {
    throw err;
  })
});


module.exports = router;
