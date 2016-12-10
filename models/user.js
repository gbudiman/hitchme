module.exports = function(sequelize, data_types) {
  var user = sequelize.define('user', {
    name: data_types.STRING,
    link: data_types.STRING,
    email: data_types.STRING,
    token: data_types.STRING
  })

  return user;
}