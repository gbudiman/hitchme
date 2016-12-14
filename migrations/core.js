module.exports = {
  up: function(queryInterface, Sequelize) {
    console.log('up called');

    queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true
      },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      token: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING, allowNull: false },
      link: { type: Sequelize.STRING, allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false }
    })

    queryInterface.createTable('events', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      name: { type: Sequelize.STRING, allowNull: false },
      address: { type: Sequelize.STRING, allowNull: false },
      time_start: { type: Sequelize.DATE, allowNull: false },
      time_end: { type: Sequelize.DATE }
    })

    queryInterface.createTable('trips', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      user_id: { type: Sequelize.BIGINT },
      event_id: { type: Sequelize.BIGINT },
      encoded_polylines: { type: Sequelize.TEXT },
      time_start: { type: Sequelize.DATE },
      space_passenger: { type: Sequelize.INTEGER },
      space_cargo: { type: Sequelize.INTEGER }
    })

    queryInterface.createTable('steps', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      trip_id: { type: Sequelize.BIGINT },
      lat: { type: Sequelize.FLOAT },
      lng: { type: Sequelize.FLOAT },
      lat_e6: { type: Sequelize.INTEGER },
      lng_e6: { type: Sequelize.INTEGER },
      time_estimation: { type: Sequelize.INTEGER }
    })

    queryInterface.createTable('passengers', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      driver_id: { type: Sequelize.BIGINT },
      passenger_id: { type: Sequelize.BIGINT },
      address: { type: Sequelize.STRING },
      time: { type: Sequelize.DATE }
    })
  },

  down: function(queryInterface, Sequelize) {
    console.log('down called');
    queryInterface.dropAllTables();
  }
}