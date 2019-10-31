const user = require('./controller/userController');
const departments = require('./controller/departmentController');
const menu = require('./controller/menuController')
const detail = require('./controller/detailController')
module.exports = {
  user,
  departments,
  menu,
  detail
};