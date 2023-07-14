import db from './db.js';

/* Schema
Supplier_id : string
Staff_id : string
Staff_name : string
Staff_contact : string
Staff_email : string
Staff_address : string
Job_role : string
Salary : float or number
*/

const findAll = async sid => {
  const sql = 'SELECT * FROM Supplier_Staffs WHERE Supplier_id = ?';
  try {
    const [rows] = await db.query(sql, [sid]);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};

const find = async (sid, id) => {
  const sql =
  'SELECT * FROM Supplier_Staffs WHERE Supplier_id = ? AND Staff_id = ?';
  try {
    const [[row]] = await db.query(sql, [sid, id]);
    return row;
  } catch (error) {
    return Promise.reject(error);
  }
};

const save = async (sid, id, staff) => {
  const sql = 'UPDATE Supplier_Staffs SET ? WHERE Supplier_id = ? AND Staff_id = ?';
  try {
    await db.query(sql, [staff, sid, id]);
  } catch (error) {
    return Promise.reject(error);
  }
};

const del = async (sid, id) => {
  const sql =
  'DELETE FROM Supplier_Staffs WHERE Supplier_id = ? AND Staff_id = ?';
  try {
    await db.query(sql, [sid, id]);
  } catch (error) {
    return Promise.reject(error);
  }
};

const add = async staff => {
  const sql = 'INSERT INTO Supplier_Staffs VALUES ?';
  const fields = [
    'Supplier_id',
    'Staff_id',
    'Staff_name',
    'Staff_contact',
    'Staff_email',
    'Staff_address',
    'Job_role',
    'Salary'
  ];
  try {
    const rows = await findAll(staff['Supplier_id']);
    console.log(rows, rows.length);
    let maxm=0;
    if(rows.length==0) {
      maxm=0;
    }
    else {
      maxm=Math.max(...rows.map(row => row['Staff_id']));
    }
  
    staff['Staff_id'] = maxm + 1;
    await db.query(sql, [[fields.map(col => staff[col])]]);
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
