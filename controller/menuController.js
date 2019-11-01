
const configTwo = {
    client: 'mssql',
    connection: {
    user:  'mgr',
    password: 'mgr',
    server: '35.197.137.111\\SQL2016',
    database: 'alfa_prop_live',
    options: {encrypt: true},
    }
  };
  const configThree = {
    client: 'mssql',
    connection: {
    user:  'mgr',
    password: 'mgr',
    server: '35.197.137.111\\SQL2016',
    database: 'alfa_hosp_live',
    options: {encrypt: true},
    }
  };



function groupMenu(req, res ,next) {
    const one = require('knex')(configTwo);
    const { approval_user } = req.params;
    one
    .select()
    .from('alfa_prop_live.mgr.v_menu_group')
    .where({ 
        approval_user:`${approval_user}`,
    })
    .unionAll([ 
        one.select()
    .from('alfa_hosp_live.mgr.v_menu_group')
    .where({ approval_user:`${approval_user}`})
    ])
    .then(data => {

        let result = [];
        data.map((item)=>{
            const filter= result.filter(
                key => key.approval_name == item.approval_name);
            if(filter.length == 0){
                result.push(item);
            } else {
                const x = result.filter(key => key.approval_name !== item.approval_name);
                let plus = filter[0].total_doc + item.total_doc;
                let dataPush = {
                    approval_name : item.approval_name,
                    approval_user : item.approval_user,
                    module : item.module,
                    total_doc : plus,
                };
                x.push(dataPush);
                result = x;
            }
        });

        res.status(200).json(result)
    })
    .catch(error => res.status(500).json(error));
  } 


  
  function viewMenu(req, res ,next) {
    const one = require('knex')(configTwo);
    const { module, approval_user,} = req.params;
    one
    .select('*')
    .from('alfa_hosp_live.mgr.v_detail_menu_approval')
    .where({ 
        module: `${module}`,
        approval_user: `${approval_user}`
       })
    .unionAll([ 
        one.select('*')
    .from('alfa_prop_live.mgr.v_detail_menu_approval')
    .where({ 
        module: `${module}`,
        approval_user: `${approval_user}`
        })
    ])
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).json(error));
    next()
  } 



  function otorisasi(req, res, next) {
      const one = require('knex')(configTwo);
      const { entity_cd, doc_no, modules} = req.params;
    one
    .select('*')
    .from('alfa_hosp_live.mgr.v_cb_approval_mobile')
    .where({ 
        entity_cd: `${entity_cd}`,
        doc_no : `${doc_no}`,
        module: `${modules}`
       })
    .unionAll([ 
        one.select('*')
    .from('alfa_prop_live.mgr.v_cb_approval_mobile')
    .where({ 
        entity_cd: `${entity_cd}`,
        doc_no : `${doc_no}`,
        module: `${modules}`
        })
    ])
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).json(error));
  }






  module.exports = {
      groupMenu,
      viewMenu,
      otorisasi
  }