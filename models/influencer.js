function Influencer(sequelize, DataTypes) {
  var Influencer = sequelize.define('influencer', {
    fullname: {
      type: DataTypes.STRING,
      notEmpty: true
    },
    twitterhandle: DataTypes.STRING,
    instagram: DataTypes.STRING
  },

  {
    classMethods: {
      associate: function (db) {
        Influencer.hasMany(db.user);
      }
    } //closing inner classMethods
  } //closing outer classMethods

  ); //closing var Influencer
  return Influencer;
};

module.exports = Influencer;