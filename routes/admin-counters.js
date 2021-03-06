const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Counters = require('../db.js').Counters;
const Banks = require('../db.js').Banks;
const History = require('../db.js').History;
var recentAlert = {type: null,message: null};

function alert(type,message){
  recentAlert.type = type;
  recentAlert.message = message;
}

function nullifyAlert() {
  recentAlert.type = null;
  recentAlert.message = null;
}

router.get('/admin/counters-page', (req, res) => {
  res.render('admin-counters',{
    layout: 'dashboard',
    counters: 'active',
    type: recentAlert.type,
    message: recentAlert.message
  });
});


router.get('/admin/counters', (req, res) => {
  let id = req.query.id;
  let counterName = req.query.counterName;
  let counterDescription = req.query.counterDescription;
  let bankId = req.query.bankId;
  Counters.findAll({
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
  let name = req.body.counterName;
  Counters.create({
    counterName: name,
    counterDescription: req.body.counterDescription,
    bankId: 1
  }).then((result) => {
    History.create({
      type: 'counters',
      task: 'add',
      desc: 'Added a counter with name: '+ name,
      by: 'admin'
    }).then(() => {
      res.statusCode = 200;
      res.send({success: true});
    }).catch((err) => {
      throw err;
    })
  }).catch((err) => {
    throw err;
  })
});

router.delete('/admin/counters/:id', (req, res) => {
  let id = req.params.id;
  Counters.destroy({
    where: {
      id: id
    }
  }).then((result) => {
    if (result) {

      History.create({
        type: 'counters',
        task: 'delete',
        desc: 'Deleted a counter with id: '+ id,
        by: 'admin'
      }).then(() => {
        res.statusCode = 200,
        res.send({success: true});
      }).catch((err) => {
        throw err;
      })

    } else {
      History.create({
        type: 'counters',
        task: 'delete',
        desc: 'Failed to deleted a counter with id: '+ id,
        by: 'admin'
      }).then(() => {
        res.send({success: false});
      }).catch((err) => {
        throw err;
      })
    }
  }).catch((err) => {
    throw err;
  })
});


module.exports = router;
