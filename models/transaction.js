import db from './db.js';
/* 
 TABLE: Transactions
	transaction_no 
	Retailer_id 
	Supplier_id 
	start_date 
	end_date 
	Order_status enum("COMPLETED","PENDING","CANCELLED")
);


CREATE TABLE IF NOT EXISTS Transaction_items (
	transaction_no 
	Medicine_name 
	Quantity
	price
);

*/



const length= async function() {
  const sql = 'SELECT * FROM Transactions';
  try {
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
}
const findAll = async (id, type)=> {

  var sql ;
  if(type=='retailer')
  sql= 'SELECT * FROM Transactions WHERE Retailer_id = ?';
  else
  sql= 'SELECT * FROM Transactions WHERE Supplier_id = ?';

  try {
    const [rows] = await db.query(sql, id);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};

const find = async (sid, name) => {
  const sql =
  'SELECT * FROM Transactions WHERE Supplier_id = ? AND Medicine_name = ?';
  try {
    const [[row]] = await db.query(sql, [sid, name]);
    return row;
  } catch (error) {
    return Promise.reject(error);
  }
};

const save = async (sid, name, transaction) => {
  const sql =
  'UPDATE Transactions SET ? WHERE Supplier_id = ? AND Medicine_name = ?';
  try {
    await db.query(sql, [transaction, sid, name]);
  } catch (error) {
    return Promise.reject(error);
  }
};

const del = async (sid, name) => {
  const sql =
  'DELETE FROM Transactions WHERE Supplier_id = ? AND Medicine_name = ?';
  try {
    await db.query(sql, [sid, name]);
  } catch (error) {
    return Promise.reject(error);
  }
};
/* 
 TABLE: Transactions
	transaction_no 
	Retailer_id 
	Supplier_id 
	start_date 
	end_date 
	Order_status enum("COMPLETED","PENDING","CANCELLED")
);


CREATE TABLE IF NOT EXISTS Transaction_items (
	transaction_no 
	Medicine_name 
	Quantity
	price
);
*/


const add = async (rid, sid)=> {

//quantity_info should also contain the prices info . yet to be added
var sq='select count(*) as cnt from Transactions';
var promise=await db.query(sq);
var tno=promise[0][0]['cnt'];



    const sql = 'INSERT INTO Transactions (transaction_no, Retailer_id, Supplier_id, Start_date, Order_status) VALUES ?';
    var fields = [
     'transaction_no',
      'Retailer_id',
      'Supplier_id',
      'Start_date',
       'Order_status'
    ];
    try {

      
      var transaction={};
      transaction['Retailer_id']=rid;
      transaction['Supplier_id']=sid;
      transaction['Start_date']='2023-12-12';
      transaction['Order_status']='PENDING';
      transaction['transaction_no'] = tno;
      await db.query(sql, [[fields.map(col => transaction[col])]]);
      return tno;
    } catch (error) {
      return Promise.reject(error);
    }
};
const pending = async (id, type) => {
  var sql;
  if(type=='retailer') {
  sql=`  SELECT * FROM Transactions
    WHERE Retailer_id = ? AND Order_status = "PENDING"
  `; }
  else {
      sql=`  SELECT * FROM Transactions
    WHERE Supplier_id = ? AND Order_status = "PENDING"
  `; 
  }
  
  try {
    const [rows] = await db.query(sql, [id]);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};
const completed = async (id, type) => {
  var sql;
  if(type=='retailer') {
  sql=`  SELECT * FROM Transactions
    WHERE Retailer_id = ? AND Order_status = "COMPLETED"
  `; }
  else {
      sql=`  SELECT * FROM Transactions
    WHERE Supplier_id = ? AND Order_status = "COMPLETED"
  `; 
  }
  
  try {
    const [rows] = await db.query(sql, [id]);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};
const cancelled = async (id, type) => {
  var sql;
  if(type=='retailer') {
  sql=`  SELECT * FROM Transactions
    WHERE Retailer_id = ? AND Order_status = "CANCELLED"
  `; }
  else {
      sql=`  SELECT * FROM Transactions
    WHERE Supplier_id = ? AND Order_status = "CANCELLED"
  `; 
  }
  
  try {
    const [rows] = await db.query(sql, [id]);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};
const complete = async (tno) => {
  var sql="UPDATE Transactions SET Order_Status='COMPLETED' WHERE transaction_no= ?";  
  try {
    const [rows] = await db.query(sql, [tno]);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};
const cancel = async (tno) => {
  var sql="UPDATE Transactions SET Order_Status='CANCELLED' WHERE transaction_no= ?";  
  try {
    const [rows] = await db.query(sql, [tno]);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};
export default {
  length,
  findAll,
  find,
  save,
  del,
  add,
  pending,
  cancelled, 
  completed,
  complete,
  cancel
};
