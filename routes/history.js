const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const db = require('../db.js');
const History = db.History;
const Admins = db.Admins;

router.get('/admin/history', (req, res) => {
  History.findAll({
    where: req.query,
  }).then((history) => {
      if(history.length > 1){
          res.statusCode = 200;
          res.send(history);
      }else if (history.length == 1) {
        res.statusCode = 200;
        res.send(history[0]);
      }else {
        res.statusCode = 404;
        res.send('No history found');
      }
    }).catch((err) => {
      throw err;
    });
});

router.post('/admin/history', (req, res) => {
  History.create({
    type: req.body.type,
    message: req.body.message,
    desc: req.body.desc,
    by: req.body.by
  }).then((result) => {
    if(result){
      res.statusCode = 200;
      res.send(result)
    }
  }).catch((err) => {
    throw err;
  })
});

router.delete('/admin/history/:id', (req, res) => {
  History.destroy({
    where: {id: req.params.id}
  }).then((result) => {
    if (result) {
      res.statusCode = 200;
      res.send('Deleted');
    } else {
      res.statusCode = 404;
      res.send('Nothing Found');
    }
  }).catch((err) => {
    throw err;
  })
});


module.exports = router;
