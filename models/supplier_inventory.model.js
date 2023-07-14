import db from './db.js';

/* Schema
Supplier_id: string
Medicine_name: string
MRP: float
Stock: number
batch_no: number
expiry_date: date
*/

const findAll = async sid => {
  const sql = 'SELECT * FROM Supplier_inventory WHERE Supplier_id = ?';
  try {
    const [rows] = await db.query(sql, [sid]);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};

const find = async (sid, name) => {
  const sql =
  'SELECT * FROM Supplier_inventory WHERE Supplier_id = ? AND Medicine_name = ?';
  try {
    const [[row]] = await db.query(sql, [sid, name]);
    return row;
  } catch (error) {
    return Promise.reject(error);
  }
};

const save = async (sid, name, med) => {
  const sql =
  'UPDATE Supplier_inventory SET ? WHERE Supplier_id = ? AND Medicine_name = ?';
  try {
    await db.query(sql, [med, sid, name]);
  } catch (error) {
    return Promise.reject(error);
  }
};

const del = async (sid, name) => {
  const sql =
  'DELETE FROM Supplier_inventory WHERE Supplier_id = ? AND Medicine_name = ?';
  try {
    await db.query(sql, [sid, name]);
  } catch (error) {
    return Promise.reject(error);
  }
};

const add = async med => {
  const sql = 'INSERT INTO Supplier_inventory VALUES ?';
  const fields = ['Supplier_id', 'Medicine_name', 'MRP', 'Stock', 'batch_no', 'expiry_date'];
  try {
    await db.query(sql, [[fields.map(col => med[col])]]);
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
