const configOne = {
  client: "mssql",
  connection: {
    user: "mgr",
    password: "mgr",
    server: "35.197.137.111\\SQL2016",
    database: "alfa_adm",
    options: { encrypt: true }
  }
};

function listAllEmployees(req, res) {
  const knex = require('knex')(configOne);
  const { orderBy } = req.query;
  if (orderBy) {
    const regex = /(.*)(:)(ASC|DESC)/gi;
    if (regex.test(orderBy)) {
      knex
        .select(
          "rowID",
          "email",
          "password",
          "name",
          "gender",
          "userID",
          "Group_Cd",
          "Handphone",
          "audit_date",
          "isResetLogin",
          "pict",
          "pict_header",
          "debtor_acct",
          "menu_type",
          "wa_no",
          "notif_email",
          "notif_wa",
          "notif_sms",
          "nik_id",
          "dept_cd"
        )
        .from("mgr.sysUser")
        .then(data => res.status(200).json(data))
        .catch(error => res.status(500).json(error));
    } else {
      return res
        .status(400)
        .json("If using a filter please use [field]:ASC|DESC");
    }
  } else {
    knex
      .select(
        "rowID",
        "email",
        "password",
        "name",
        "gender",
        "userID",
        "Group_Cd",
        "Handphone",
        "audit_date",
        "isResetLogin",
        "pict",
        "pict_header",
        "debtor_acct",
        "menu_type",
        "wa_no",
        "notif_email",
        "notif_wa",
        "notif_sms",
        "nik_id",
        "dept_cd"
      )
      .from("mgr.sysUser")
      .then(data => res.status(200).json(data))
      .catch(error => res.status(500).json(error));
  }
}


function listOneEmployee(req, res) {
  const knex = require('knex')(configOne);
  const { rowID } = req.params;
  knex
    .select()
    .from("mgr.sysUser")
    .where({ rowID: `${rowID}` })
    .then(data => {
      if (data.length > 0) {
        return res.status(200).json(data[0]);
      } else {
        return res.status(404).json(`Employee with ID ${rowID} not found`);
      }
    })
    .catch(error => res.status(500).json(error));
}

module.exports = {
  listAllEmployees,
  listOneEmployee
};
