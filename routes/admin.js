const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const db = require('../db.js');
const Customers = db.Customers;
const Banks = db.Banks;
const History = db.History;


router.post('/admin/customer', (req, res) => {
  Customers.create({
    name: req.body.name,
    mobileNo: req.body.phoneNo,
    bankId: 1
  }).then((p) => {
    History.create({
      type: 'customers',
      task: 'add',
      desc: 'Added a customer with name: '+ name + ' mobileNo: '+ mobileNo+'.',
      by: 'admin'
    }).then((result) => {
      res.send({success: true});
      res.statusCode = 200;
    }).catch((err) => {
      throw err;
    })
  }).catch((err) => {
    res.statusCode = 404;
    res.send({success: false})
  })
});

router.put('/admin/customer', (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let mobileNo = req.body.mobileNo;
  Customers.update({
    name: name,
    mobileNo: mobileNo,
  },{where: {id: id}}).then((customer) => {
    History.create({
      type: 'customers',
      task: 'update',
      desc: 'Updated a customer with name: '+ name + ' mobileNo: '+ mobileNo+'.',
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

router.delete('/admin/customer', (req, res) => {
  let id = req.body.id;
  Customers.find({where: {id: id}}).then(() => {
      Customers.destroy({
        where: {id: id}
      }).then((customer) => {
        if(customer != 0){
          History.create({
            type: 'customers',
            task: 'delete',
            desc: 'Deleted a customer with id: '+ id,
            by: 'admin'
          }).then((result) => {
            res.statusCode = 200;
            res.send({success: true});
          }).catch((err) => {
            throw err;
          })
        }
      else{
        History.create({
          type: 'customers',
          task: 'delete',
          desc: 'Failed to delete a customer as no such id:'+id+' was found',
          by: 'admin'
        }).then((result) => {
          res.send({success: false});
        }).catch((err) => {
          throw err;
        })
      }
      }).catch((err) => {
        throw err;
      })

    }).catch((err) => {
      throw err;
    });

});

router.get('/admin/customer', (req, res) => {
  Customers.find({
    where: req.query,
    include: [Banks]
  }).then((customer) => {
      if(customer){

        let details = {
          id: customer.id,
          name: customer.name,
          phoneNo: customer.mobileNo,
          bank: customer.bank.bankName,
          branch: customer.bank.branch,
          openTime: customer.bank.openTime,
          lunchTime: customer.bank.lunchTime,
          closeTime: customer.bank.closeTime,
          success: true
        }
        res.statusCode = 200;
        res.send(details);
      }else {
        res.send({success: false});
      }
    }).catch((err) => {
      throw err;
    });
});


module.exports = router;
