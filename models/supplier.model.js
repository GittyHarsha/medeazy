import db from './db.js';

/* Schema
Supplier_id : string
Supplier_name : string
Supplier_contact : string
Supplier_email : string
Supplier_address : string
*/

// dont use this function
const findAll = async id => {
  const sql = 'SELECT * FROM Suppliers';
  try {
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};
const find = async (id) => {
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

const add = async supplier => {
  const sql = 'INSERT INTO Suppliers VALUES ?';
  const fields = [
    'Supplier_id',
    'Supplier_name',
    'Supplier_contact',
    'Supplier_email',
    'Supplier_address'
  ];
  try {
    const rows = await findAll(supplier['Supplier_id']);
    
    supplier['Supplier_id'] = rows.length + 1;
    await db.query(sql, [[fields.map(col => supplier[col])]]);
    console.log(`supplier with id ${supplier['Supplier_id']} added successfully`);
    return supplier['Supplier_id'];
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
