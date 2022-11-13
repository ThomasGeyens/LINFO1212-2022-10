const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db.sqlite'
});

const Accident = sequelize.define('Accident', {
  // Model attributes are defined here
  address: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

const User = sequelize.define('User', {
  // Model attributes are defined here
  username: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

User.hasMany(Accident);
Accident.belongsTo(User);

module.exports = {
  testCon: async function () {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  },

  pushAccident: async function (addr, desc, userId) {
    const newAccident = await Accident.create({ address: addr, description: desc, UserId: userId});
    console.log('New accident was saved to the database!');
  },

  getUser: async function (username) {
    return User.findOne({where: { username: username }});
  },
  getAccidents: async function () {
    return Accident.findAll();
  },
  User,
  Accident
};

async function syncr () {
  await sequelize.sync({ force: true });
}

//syncr();