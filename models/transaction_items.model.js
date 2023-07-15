import db from './db.js';
/* 
 TABLE: Transactions_items
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
  const sql = 'SELECT * FROM Transactions_items';
  try {
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
}
const findAll = async (id, type)=> {

  const sql = 'SELECT * FROM Transactions_items WHERE Supplier_id = ?';
  try {
    const [rows] = await db.query(sql, [sid]);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};

const find = async (sid, name) => {
  const sql =
  'SELECT * FROM Transactions_items WHERE Supplier_id = ? AND Medicine_name = ?';
  try {
    const [[row]] = await db.query(sql, [sid, name]);
    return row;
  } catch (error) {
    return Promise.reject(error);
  }
};

const save = async (sid, name, transaction) => {
  const sql =
  'UPDATE Transactions_items SET ? WHERE Supplier_id = ? AND Medicine_name = ?';
  try {
    await db.query(sql, [transaction, sid, name]);
  } catch (error) {
    return Promise.reject(error);
  }
};

const del = async (sid, name) => {
  const sql =
  'DELETE FROM Transactions_items WHERE Supplier_id = ? AND Medicine_name = ?';
  try {
    await db.query(sql, [sid, name]);
  } catch (error) {
    return Promise.reject(error);
  }
};
/* 
 TABLE: Transactions_items
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


const add = async (item)=> {

//quantity_info should also contain the prices info . yet to be added
var sq='select count(*) as cnt from Transactions';
var promise=await db.query(sq);

    const sql = 'INSERT INTO Transaction_items VALUES ?';
    var fields = [
     'transaction_no',
      'Medicine_name',
      'Quantity',
      'price',
    ];
    try {

      await db.query(sql, [[fields.map(col => item[col])]])
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
