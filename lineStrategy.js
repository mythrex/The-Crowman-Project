const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const db = require('./db.js');
const Admins = db.Admins;
const Counters = db.Counters;
const Customers = db.Customers;
const History = db.History;

router.post('/counters/next/:counterId', (req, res) => {
  let counterId = req.params.counterId;
  //Just update done to any previous onCounter customer
  Counters.find({
    where: {
      id: counterId
    }
  }).then((counter) => {
        let custId = counter.customerId;
        if(custId != null){

          Customers.update({
            status: 'done'
          },{
            where: {
              id: custId
            }
          }).then((result) => {
            if (result) {
              History.create({
                type: 'counters',
                task: 'update',
                desc: 'Updated the status of the first onCounter customer with id '+ custId + ' to done',
                by: 'counter'
              });
            }

            //finding next customer
              Customers.findOne({
                where: {
                  status: 'inLine'
                }
              }).then((customer) => {

                  if (customer) {
                    customer.update({
                      status: 'atCounter',
                    }).then((customer) => {

                      History.create({
                        type: 'counters',
                        task: 'update',
                        desc: 'Updated the status of the first inLine customer with id '+ custId + ' to OnCounter',
                        by: 'counter'
                      });

                      let customerId = customer.id;

                      //updating customerId in counters table
                          Counters.update({
                            customerId: customerId,
                          },{
                            where: {
                              id: counterId
                            }
                          }).then((counter) => {

                            History.create({
                              type: 'counters',
                              task: 'update',
                              desc: 'Updated the customerId: '+customerId+' in counter '+counter.name,
                              by: 'counter'
                            });

                            res.send({success: true});

                          }).catch((err) => {
                            throw err;
                          });

                    }).catch((err) => {
                      throw err;
                    });
                  }else{
                    res.send({success: false});
                  }

                }).catch((err) => {
                  throw err;
                });

          }).catch((err) => {
            throw err;
          });

        }//end of if
        else{

          //finding next customer
              Customers.findOne({
                where: {
                  status: 'inLine'
                }
              }).then((customer) => {

                  if (customer) {
                    customer.update({
                      status: 'atCounter',
                    }).then((customer) => {

                      History.create({
                        type: 'counters',
                        task: 'update',
                        desc: 'Updated the status of the first inLine customer with id '+ custId + ' to OnCounter',
                        by: 'counter'
                      });

                      let customerId = customer.id;

                      //updating customerId in counters table
                          Counters.update({
                            customerId: customerId,
                          },{
                            where: {
                              id: counterId
                            }
                          }).then((counter) => {

                            History.create({
                              type: 'counters',
                              task: 'update',
                              desc: 'Updated the customerId: '+customerId+' in counter '+counter.name,
                              by: 'counter'
                            });

                            res.send({success: true});

                          }).catch((err) => {
                            throw err;
                          });

                    }).catch((err) => {
                      throw err;
                    });
                  }else{
                    res.send({success: false})
                  }

                }).catch((err) => {
                  throw err;
                });
        }

    }).catch((err) => {
      throw err;
    });



});

module.exports = router;
