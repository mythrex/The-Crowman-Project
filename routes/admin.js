const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const db = require('../db.js');
const Customers = db.Customers;
const Banks = db.Banks;



router.post('/addCust', (req, res) => {
  Customers.create({
    name: req.body.name,
    mobileNo: req.body.phoneNo,
    bankId: 1
  }).then((p) => {
    res.send({success: true})
  }).catch((err) => {
    res.send({success: false})
  })
});

router.get('/searchCust', (req, res) => {
  let id = req.query.id;
  Customers.find({
    where: {id: id},
  }).then((customer) => {
      if(customer){
        res.send({
          success: true,
          name: customer.name,
          phoneNo: customer.mobileNo
        });
      }
      else {
        res.send({success: false})
      }
    }).catch((err) => {
      throw err;
    });
});

router.post('/updateCust', (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let mobileNo = req.body.mobileNo;
  console.log(id,name,mobileNo);

  Customers.update({
    name: name,
    mobileNo: mobileNo,
  },{where: {id: id}}).then((customer) => {
      res.send({success: true})
    }).catch((err) => {
      throw err;
    })
});

router.post('/removeCust', (req, res) => {
  let id = req.body.id;
  Customers.find({where: {id: id}}).then(() => {

      Customers.destroy({
        where: {id: id}
      }).then((customer) => {
        console.log(customer);
        if(customer != 0)
          res.send({success: true});
        else
        res.send({success: false});
      }).catch((err) => {
        throw err;
      })

    }).catch((err) => {
      throw err;
    });

});

router.get('/findCustDetails', (req, res) => {
  let id = +req.query.id;

  Customers.find({
    where: {id: id},
    include: Banks}).then((customer) => {
      if(customer){
        let details = {
          id: customer.id,
          name: customer.name,
          phoneNo: customer.mobileNo,
          bank: customer.bank.bankName,
          branch: customer.bank.branch,
          openTime: customer.bank.openTime,
          lunchTime: customer.bank.lunchTime,
          closeTime: customer.bank.closeTime
        }
        res.render('admin',{
          details: details,
          layout: 'dashboard'
        });
      }else {
        res.render('admin',{
          noDetails: 'No Details for such ID',
          layout: 'dashboard',
          customers: 'active'
        });
      }
    }).catch((err) => {
      throw err;
    });
});


module.exports = router;
