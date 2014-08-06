module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('influencers',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      twitterhandle: DataTypes.STRING,
      instagram: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      userId: {
        type: DataTypes.INTEGER,
        foreignKey: true
      }
    })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('influencers')
    .complete(done);
  }
};
