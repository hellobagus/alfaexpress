
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
    .where({ approval_user:`${approval_user}`})
    .unionAll([ 
        one.select()
    .from('alfa_hosp_live.mgr.v_menu_group')
    .where({ approval_user:`${approval_user}`})
    ])
    .then(data => {

        let result = [];
        data.map((item)=>{
            const filter= result.filter(key => key.approval_name == item.approval_name);
            if(filter.length == 0){
                result.push(item);
            } else {
                const x = result.filter(key => key.approval_name !== item.approval_name);
                let plus = filter[0].total_doc + item.total_doc;
                let dataPush = {
                    approval_name : item.approval_name,
                    approval_user : item.approval_user,
                    total_doc : plus
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
    const { module} = req.params;

    one
    .select()
    .from('alfa_hosp_live.mgr.v_detail_menu_approval')
    .where({ 
        module:`${module}`})
    .unionAll([ 
        one.select()
    .from('alfa_prop_live.mgr.v_detail_menu_approval')
    .where({ 
        module:`${module}`})
    ])
    .then(data => {

        let result = [];
        data.map((item)=>{
            const filter= result.filter(key => key.module == item.module);
            if(filter.length == 0){
                result.push(item);
            } else {
                const x = result.filter(key => key.module !== item.module);
                let plus = filter[0].total_doc + item.total_doc;
                let dataPush = {
                    doc_no : item.doc_no,
                    trx_type : item.trx_type,
                    doc_date : item.doc_date,
                    approval_user_name : item.approval_user_name,
                    approval_status : item.approval_status,
                    approval_name : item.approval_name,
                    approval_user : item.approval_user,
                    entity_cd : item.entity_cd,
                    entity_name : item.entity_name,
                    descs : item.descs,
                    ref_no : item.ref_no,
                    level_no : item.level_no,
                    request_staff_id : item.request_staff_id,
                    request_staff_name : item.request_staff_name,
                    request_dept_cd : item.request_dept_cd,
                    request_dept_name : item.request_dept_name,
                    amount : item.amount,
                  

                };
                x.push(dataPush);
                result = x;
            }
        });

        res.status(200).json(result)
    })
   
    .catch(error => res.status(500).json(error));
  } 







  module.exports = {
      groupMenu,
      viewMenu
  }