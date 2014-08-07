module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.createTable("user_influencers",{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      influencerId: {
        type: DataTypes.INTEGER,
        foreignKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        foreignKey: true
      }
    })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.dropTable("user_influencers")
    .complete(done);
  }
};
