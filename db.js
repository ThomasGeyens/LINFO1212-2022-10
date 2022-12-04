const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db.sqlite'
});

const Song = sequelize.define('Song', {
  // Model attributes are defined here
  name_artist: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true   //test 
  },
  genre: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true //test
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

User.hasMany(Song);
Song.belongsTo(User);

module.exports = {
  testCon: async function () {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  },

  pushSong: async function (na_art, desc, rat, gnr, userId) {
    const newSong = await Song.create({ name_artist: na_art, description: desc, rating: rat, genre: gnr, UserId: userId});
    console.log('New Song was saved to the database!');
  },

  getUser: async function (username) {
    return User.findOne({where: { username: username }});
  },
  getSongs: async function () {
    return Song.findAll();
  },
  User,
  Song
};

async function syncr () {
  await sequelize.sync({ force: true });
}

//syncr(); //Pour faire un changement dans la base de donnée il est nécessaire d'enelever ce comm