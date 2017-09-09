const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const db = require('../db.js');
const Messages = db.Messages;
const Admins = db.Admins;
const History = db.History;

router.get('/admin/messages', (req, res) => {
  Messages.findAll({
    where: req.query,
  }).then((messages) => {
      if(messages.length > 1){
          res.statusCode = 200;
          res.send(messages);
      }else if (messages.length == 1) {
        res.statusCode = 200;
        res.send(messages[0]);
      }else {
        res.statusCode = 404;
        res.send('No messages found');
      }
    }).catch((err) => {
      throw err;
    });
});

router.post('/admin/messages', (req, res) => {
  let message = req.body.message
  Messages.create({
    type: req.body.type,
    message: message,
    adminId: 1,
  }).then((result) => {
    if(result){

      History.create({
        type: 'messages',
        task: 'add',
        desc: 'Added a message with message: '+ message,
        by: 'admin'
      });

      res.statusCode = 200;
      res.send(result)
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
      res.send('Deleted');
    } else {
      History.create({
        type: 'messages',
        task: 'delete',
        desc: 'Failed to deleted a message with id: '+ id,
        by: 'admin'
      });
      res.statusCode = 404;
      res.send('Nothing Found');
    }
  }).catch((err) => {
    throw err;
  })
});


module.exports = router;
