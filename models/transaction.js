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
const findAll = async (id, type)=> {

  const sql = 'SELECT * FROM Transactions WHERE Supplier_id = ?';
  try {
    const [rows] = await db.query(sql, [sid]);
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
    await db.query(sql, [transactio, sid, name]);
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


const add = async (transcation, quantity_info)=> {

    var quantity={};
    for(key in quantity_info) {
        if(key.includes("quantity")) {
    
            quantity[key.substr(9)]=quantity_info[key];
        }
    }
    const sql = 'INSERT INTO Transcations VALUES ?';
    const fields = [
     'transaction_no',
      'Retailer_id',
      'Supplier_id',
      'Start_date',
       'Order_status'
    ];
    try {
      const rows = await db.query('select * from Transactions');
      console.log(rows, rows.length);
      
    
    
  
      transaction['transaction_no'] = rows.length+ 1;
      await db.query(sql, [[fields.map(col => transaction[col])]]);
    } catch (error) {
      return Promise.reject(error);
    }
};

export default {
  findAll,
  find,
  save,
  del,
  add
};
