const sql = require('mssql');

/* SQL CONFIG */
const sql_config = {
  user:  'mgr',
  password: 'mgr',
  server: '35.197.137.111\\SQL2016',
  database: 'alfa_adm',
  options: {encrypt: true},
}

sql.on('error', err => {
  console.log('SQL ERROR:');
  console.log(err);
})

var conx;
sql.connect(sql_config).then(pool => {
	conx = pool;
});

module.exports = function(query, params) {
	
	params = params || {}; // default to empty JSON if undefined
	
	var req = conx.request();

	// loop through params JSON and add them as input
	Object.keys(params).forEach(key => {
		req.input(key, params[key]);
	})
		
	return req.query(query).then(result => {
		return result.recordset;
	}).catch(err => {
		console.log(err);
		return null;
	});
}
