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

  //les fonctions ici vont permettre de trouver la moyenne par genre
  getAverageRatingForPop: async function(userId) {
    return Song.findAll({
      attributes: [
        'UserId',
        'genre',
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      where: { 
        userId: userId,
        genre: "Pop" 
      },
      group: ['UserId', 'genre']
    });
  },

  getAverageRatingForRap: async function(userId) {
    return Song.findAll({
      attributes: [
        'UserId',
        'genre',
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      where: { 
        userId: userId,
        genre: "Rap" 
      },
      group: ['UserId', 'genre']
    });
  },
  getAverageRatingForElectro: async function(userId) {
    return Song.findAll({
      attributes: [
        'UserId',
        'genre',
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      where: { 
        userId: userId,
        genre: "Electro" 
      },
      group: ['UserId', 'genre']
    });
  },
  getAverageRatingForRock: async function(userId) {
    return Song.findAll({
      attributes: [
        'UserId',
        'genre',
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      where: { 
        userId: userId,
        genre: "Rock" 
      },
      group: ['UserId', 'genre']
    });
  },
  getAverageRatingForClassique: async function(userId) {
    return Song.findAll({
      attributes: [
        'UserId',
        'genre',
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      where: { 
        userId: userId,
        genre: "Classique" 
      },
      group: ['UserId', 'genre']
    });
  },
  getAverageRatingForRnB: async function(userId) {
    return Song.findAll({
      attributes: [
        'UserId',
        'genre',
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      where: { 
        userId: userId,
        genre: "RnB" 
      },
      group: ['UserId', 'genre']
    });
  },
  getAverageRatingForJazz: async function(userId) {
    return Song.findAll({
      attributes: [
        'UserId',
        'genre',
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      where: { 
        userId: userId,
        genre: "Jazz" 
      },
      group: ['UserId', 'genre']
    });
  },

  //les fonctions ci-dessous vont permettre de calculer le nombre de son par genre
  get_nbr_of_pop: async function(userId) {
    return Song.count({
      where: { 
        userId: userId,
        genre: "Pop" 
      },
      group: ['UserId', 'genre']
    });
  },

  get_nbr_of_rap: async function(userId) {
    return Song.count({
      where: { 
        userId: userId,
        genre: "Rap" 
      },
      group: ['UserId', 'genre']
    });
  },
  get_nbr_of_electro: async function(userId) {
    return Song.count({
      where: { 
        userId: userId,
        genre: "Electro" 
      },
      group: ['UserId', 'genre']
    });
  },
  get_nbr_of_rock: async function(userId) {
    return Song.count({
      where: { 
        userId: userId,
        genre: "Rock" 
      },
      group: ['UserId', 'genre']
    });
  },
  get_nbr_of_classique: async function(userId) {
    return Song.count({
      where: { 
        userId: userId,
        genre: "Classique" 
      },
      group: ['UserId', 'genre']
    });
  },
  get_nbr_of_rnb: async function(userId) {
    return Song.count({
      where: { 
        userId: userId,
        genre: "RnB" 
      },
      group: ['UserId', 'genre']
    });
  },
  get_nbr_of_jazz: async function(userId) {
    return Song.count({
      where: { 
        userId: userId,
        genre: "Jazz" 
      },
      group: ['UserId', 'genre']
    });
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