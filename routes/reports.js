const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const db = require('../db.js');
const Counters = db.Counters;
const Customers = db.Customers;
const Messages = db.Messages;
const Admins = db.Admins;
const History = db.History;

function countTotalNoOfMessages() {
  Messages.count().then((c) => {
    console.log('Messages Sent: '+c);
    return c;
  }).catch((err) => {
    throw err;
  })
}

function countDoneCustomers(){
  Customers.count({
    where: {
      status: 'done'
    }
  }).then((c) => {
    console.log('Customers Done: '+ c);
    return c;
  }).catch((err) => {
    throw err;
  })
}

function noOfCounters(){
  Counters.count().then((c) => {
    console.log('Totol No of counters: '+c);
    return c;
  }).catch((err) => {
    throw err;
  })
}

function counterWithCustomerDetails() {
  let arr = [];
  Counters.findAll().then((counters) => {
      for(counter of counters) {
        let obj = {},cust = {};
        obj.name = counter.counterName;
        obj.customerId = counter.customerId;
        Customers.find({
          where: {
            id: obj.customerId
          }
        }).then((customer) => {
            cust.name = customer.name;
            cust.mobileNo = customer.mobileNo;
            cust.status = customer.status;
            obj.customer = cust;
            arr.push(obj);
          }).catch((err) => {
            throw err;
          });
      }
    }).catch((err) => {
      throw err;
    });
}

function countCustomers() {
  Customers.count().then((c) => {
    console.log('Total No. of Customers are: '+ c);
    return c;
  }).catch((err) => {
    throw err;
  });
}

countCustomers()
module.exports = router;
