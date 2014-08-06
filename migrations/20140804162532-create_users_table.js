module.exports = {
  up: function(migration, DataTypes, done) {
    // creating db table for users
    migration.createTable('users',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        isEmail: true,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('users')
    .complete(done);
  }
};
