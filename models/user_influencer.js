
module.exports = function(sequelize, DataTypes) {
  var UserInfluencer = sequelize.define("user_influencers",
    {
      influencerId: {
        type: DataTypes.INTEGER,
        foreignKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        foreignKey: true
      },
    },
      {
        classMethods: {
          associate: function (db) {
            UserInfluencer.belongsTo(db.user);
            UserInfluencer.belongsTo(db.influencer);
          }
        }
      });
  return UserInfluencer;
}