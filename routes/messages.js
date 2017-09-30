const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const db = require('../db.js');
const Messages = db.Messages;
const Admins = db.Admins;
const History = db.History;

router.get('/admin/messages-page', (req, res) => {
  res.render('admin-messages',{
    layout: 'dashboard',
    messages: 'active',
  });
});

router.get('/admin/messages', (req, res) => {
  Messages.findAll({
    where: req.query,
    order: [["updatedAt","DESC"]]
  }).then((messages) => {
      if(messages.length >= 1){
          res.statusCode = 200;
          res.send(messages);
      }else {
        res.statusCode = 404;
        res.send('No messages found');
      }
    }).catch((err) => {
      throw err;
    });
});

router.post('/admin/messages', (req, res) => {
  let message = req.body.message;
  let type = req.body.type;
  Messages.create({
    type: type,
    message: message,
    adminId: 1,
  }).then((result) => {
    if(result){

      History.create({
        type: 'messages',
        task: 'add',
        desc: 'Added a message with message: '+ message +' of type: '+type,
        by: 'admin'
      });

      res.statusCode = 200;
      res.send({success: true})
    }
  }).catch((err) => {
    throw err;
  })
});

router.put('/admin/messages', (req, res) => {
  let id = req.body.id;
  let type = req.body.type;
  let message = req.body.message;
  console.log(req.body);
  Messages.update({
    type: type,
    message: message,
  },{
    where: {
      id: id
    }
  }).then((result) => {
    if(result){

      History.create({
        type: 'messages',
        task: 'update',
        desc: 'Updated a message with message: '+ message + ' type: '+type,
        by: 'admin'
      });

      res.statusCode = 200;
      res.send({success: true})
    }
  }).catch((err) => {
    throw err;
  })
});

router.delete('/admin/messages/:id', (req, res) => {
  let id = req.params.id;

  Messages.destroy({
    where: {id: id}
  }).then((result) => {
    if (result) {
      History.create({
        type: 'messages',
        task: 'delete',
        desc: 'Deleted a message with id: '+ id,
        by: 'admin'
      });
      res.statusCode = 200;
      res.send({success: true});
    } else {
      History.create({
        type: 'messages',
        task: 'delete',
        desc: 'Failed to deleted a message with id: '+ id,
        by: 'admin'
      });
      res.statusCode = 404;
      res.send({success: false});
    }
  }).catch((err) => {
    throw err;
  })
});

router.get('/admin/messages/count', (req, res) => {
  Messages.count({
    where: req.query,
  }).then((c) => {
      res.statusCode = 200;
      res.send({count: c});
    }).catch((err) => {
      throw err;
    });
});

module.exports = router;
