module.exports = function(sequelize, data_types) {
  var user = sequelize.define('user', {
    name: data_types.STRING
  })

  return user;
}