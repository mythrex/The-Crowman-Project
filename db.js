const Sequelize = require('sequelize');
//connect to db
//TODO setup-the project and db
const db = new Sequelize("mydb","mythrex","123",{
  dialect: "postgres",
  host: "localhost"
});

//admintable
const admins = db.define('admins',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING
  }
});
//bank table
const banks = db.define('banks',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bankName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  branch: {
    type: Sequelize.STRING,
    allowNull: false
  },
  openTime: {
    type: Sequelize.TIME
  },
  lunchTime: {
    type: Sequelize.TIME
  },
  closeTime: {
    type: Sequelize.TIME
  }
});

//customer table
const customers = db.define('customers',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mobileNo: {
    type: Sequelize.STRING,
  },
});

//bank table
const counters = db.define('counters',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  counterName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  counterDescription: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

//associations
banks.hasMany(customers);
customers.belongsTo(banks);

banks.hasMany(counters);
counters.belongsTo(banks);

db.sync().then(() => {
  console.log("connected to db");
}).catch((err) => {
  throw err;
})

module.exports = {
  Admins: admins,
  Banks: banks,
  Customers: customers,
  Counters: counters
};
