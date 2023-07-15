import db from './db.js';

/* Schema
Supplier_id : string
Supplier_name : string
Supplier_contact : string
Supplier_email : string
Supplier_address : string
*/

// dont use this function
const findAll = async (sid, rid) => {
  const sql = 'SELECT * FROM Suppliers where Supplier_id=?, Retailer_id=?';
  try {
    const [rows] = await db.query(sql, [sid, rid]);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};
const find_supplier = async (id) => {
  const sql =
  'SELECT * FROM Suppliers WHERE Supplier_id = ?';
  try {
    const [[row]] = await db.query(sql, id);
    return row;
  } catch (error) {
    return Promise.reject(error);
  }
};
const find_retailer = async (id) => {
    const sql =
    'SELECT * FROM Suppliers WHERE Supplier_id = ?';
    try {
      const [[row]] = await db.query(sql, id);
      return row;
    } catch (error) {
      return Promise.reject(error);
    }
  };
const save = async (id) => {
  const sql =
  'UPDATE Suppliers SET ? WHERE Supplier_id = ?';
  try {
    await db.query(sql, [supplier, id]);
  } catch (error) {
    return Promise.reject(error);
  }
};

const del = async (id) => {
  const sql =
  'DELETE FROM Suppliers WHERE Supplier_id = ?';
  try {
    await db.query(sql, id);
  } catch (error) {
    return Promise.reject(error);
  }
};

const add = async (rid, sid) => {
  const sql = 'INSERT INTO Suppliers VALUES (?, ?)';
  const fields = [
    'Supplier_id',
    'Retailer_id'
  ];
  try {
    const rows = await findAll(rid, sid);
    
    if(rows.length==0) {
    await db.query(sql, [sid, rid]);
    console.log("friends rid: ",rid, " sid: ", sid, "added successfully");
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export default {
  findAll,
  find_supplier,
  find_retailer,

  save,
  del,
  add
};
