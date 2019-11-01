const express = require('express');
const app = express();
const router = express.Router();
const settings = require('./settings');
const routes = require('./routes');
const middlewares = require('./middlewares');
const bodyparser = require('body-parser');
const session = require('./session');
const cookieParser = require('cookie-parser')

const cors = require('cors');
router.use(cors());
router.use(bodyparser.json());
router.use(session.passport.initialize());
router.use(cookieParser())


const knex = require('knex')({
  client: 'mssql',
  connection: settings.databaseTwo
});


app.locals.knex = knex;


router.post('/login', session.passport.authenticate('local', { failureRedirect: '/login' }), function(req, res , next) {
	req.token = session.generateToken(req.user);
	res.json({
		token: req.token,
    user: req.user,
  });
  next()
});

router.get('/me', session.check,  function(req, res) {
  res.json(req.user);
  next()
});


router.get('/user',session.check, routes.user.listAllEmployees);
router.get('/user/:rowID', session.check, routes.user.listOneEmployee);
router.get('/menu/:approval_user',session.check, routes.menu.groupMenu);
router.get('/menu/:approval_user/:module',routes.menu.viewMenu);
router.get('/detail/:module', routes.menu.viewMenu);

// router.get('/employees/:id', middlewares.authenticate, middlewares.getIDAsInteger,routes.employees.listOneEmployee);
// router.post('/employees', jsonParser, routes.employees.createEmployee);
// router.patch('/employees/:id', jsonParser, middlewares.getIDAsInteger, routes.employees.updateEmployee);
// router.delete('/employees/:id', middlewares.getIDAsInteger, routes.employees.deleteEmployee);

// router.get('/departments', routes.departments.listAllDepartments);
// router.get('/departments/:id', middlewares.getIDAsInteger, routes.departments.listOneDepartment);
// router.get('/departments/:id/employees', middlewares.getIDAsInteger, routes.departments.getDepartmentEmployees);
// router.post('/departments', jsonParser, routes.departments.createDepartment);
// router.patch('/departments/:id', jsonParser, middlewares.getIDAsInteger, routes.departments.updateDepartment);
// router.delete('/departments/:id', middlewares.getIDAsInteger, routes.departments.deleteDepartment);

app.use('/api', router);

// app.listen(settings.APIServerPort, () => console.info(`Server is listening on ${settings.APIServerPort}.`));
app.listen(process.env.PORT || 1908);