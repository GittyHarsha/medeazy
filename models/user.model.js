import bcrypt from 'bcrypt';
import db from './db.js';

/* Schema
uid : int
name : string
id : string
*/

const verifyPassword = async (username, password, type) => {
  if(type=='supplier') {
  let sql;
  try {
    const User = { name: username };
    sql = 'SELECT Supplier_id FROM Suppliers WHERE Supplier_name = ?';
    const [suppliers] = await db.query(sql, [username]);
    if (suppliers.length !== 1) {
      return null;
    }
    User.id = suppliers[0]['Supplier_id'];
    sql =
    'SELECT User_id, Password_hash FROM User_Accounts WHERE Supplier_id = ?';
    const [[row]] = await db.query(sql, [User.id]);
    User.uid = row['User_id'];
    const hash = row['Password_hash'].toString();
    const result = await bcrypt.compare(password, hash);
    return result ? User : null;
  } catch (error) {
    return Promise.reject(error);
  }
}
else {
  let sql;
  try {
    const User = { name: username };
    sql = 'SELECT Retailer_id FROM Retailers WHERE Retailer_name = ?';
    const [retailers] = await db.query(sql, [username]);
    if (retailers.length !== 1) {
      return null;
    }
    User.id = retailers[0]['Retailer_id'];
    sql =
    'SELECT User_id, Password_hash FROM User_Accounts WHERE Retailer_id = ?';
    const [[row]] = await db.query(sql, [User.id]);
    User.uid = row['User_id'];
    const hash = row['Password_hash'].toString();
    const result = await bcrypt.compare(password, hash);
    return result ? User : null;
  } catch (error) {
    return Promise.reject(error);
  }
}
};

const verifyById = async (password, id, type) => {
  if(type=='retailer') {
  const sql =
  'SELECT Password_hash FROM User_Accounts WHERE Retailer_id = ?';
  try {
    const [[row]] = await db.query(sql, [rd]);
    const hash = row['Password_hash'].toString();
    const result = await bcrypt.compare(password, hash);
    return result;
  } catch (error) {
    return Promise.reject(error);
  }
}
else {
  const sql =
  'SELECT Password_hash FROM User_Accounts WHERE Supplier_id = ?';
  try {
    const [[row]] = await db.query(sql, [id]);
    const hash = row['Password_hash'].toString();
    const result = await bcrypt.compare(password, hash);
    return result;
  } catch (error) {
    return Promise.reject(error);
  }
}
};

const changePassword = async (newPassword, id, type) => {
  if(type=='retailer') {
  const sql =
  'UPDATE User_Accounts SET Password_hash = ? WHERE Retailer_id = ?';
  try {
    const hash = await bcrypt.hash(newPassword, 10);
    const result = await db.query(sql, [hash, id]);
    return result.affectedRows === 1;
    // assert result.affectedRows === 1
  } catch (error) {
    return Promise.reject(error);
  } 
}
else {
  const sql =
  'UPDATE User_Accounts SET Password_hash = ? WHERE Supplier_id = ?';
  try {
    const hash = await bcrypt.hash(newPassword, 10);
    const result = await db.query(sql, [hash, id]);
    return result.affectedRows === 1;
    // assert result.affectedRows === 1
  } catch (error) {
    return Promise.reject(error);
  } 
}
};

const findHintQ = async (username, type) => {
  if(type=='retailer') {
  let sql;
  try {
    sql = 'SELECT Retailer_id FROM Retailers WHERE Retailer_name = ?';
    const [retailers] = await db.query(sql, [username]);
    if (retailers.length !== 1) {
      return null;
    }
    const id = retailers[0]['Retailer_id'];
    sql = 'SELECT Hint_question FROM User_Accounts WHERE Retailer_id = ?';
    const [[row]] = await db.query(sql, [id]);
    if (row['Hint_question']) {
      return [row['Hint_question'], id];
    }
    return null;
  } catch (error) {
    return Promise.reject(error);
  }
}
else {
  let sql;
  try {
    sql = 'SELECT Supplier_id FROM Suppliers WHERE Supplier_name = ?';
    const [supplier] = await db.query(sql, [username]);
    if (supplier.length !== 1) {
      return null;
    }
    const id = supplier[0]['Supplier_id'];
    sql = 'SELECT Hint_question FROM User_Accounts WHERE Supplier_id = ?';
    const [[row]] = await db.query(sql, [id]);
    if (row['Hint_question']) {
      return [row['Hint_question'], id];
    }
    return null;
  } catch (error) {
    return Promise.reject(error);
  }
}
};

const verifyAnswer = async (id, ans, type) => {
  if(type=='retailer') {
  const sql = 'SELECT Answer FROM User_Accounts WHERE Retailer_id = ?';
  try {
    const [[row]] = await db.query(sql, [id]);
    if (row && row.Answer === ans) {
      return true;
    }
    return false;
  } catch (error) {
    return Promise.reject(error);
  }
}
else {
  const sql = 'SELECT Answer FROM User_Accounts WHERE Supplier_id = ?';
  try {
    const [[row]] = await db.query(sql, [id]);
    if (row && row.Answer === ans) {
      return true;
    }
    return false;
  } catch (error) {
    return Promise.reject(error);
  }
}
};

const add = async (user, customer_type) => {
  if(customer_type=='retailer') {
   const sql = `
    INSERT INTO User_Accounts
    (Password_hash, Hint_question, Answer, Retailer_id) VALUES ?
  `;
  const fields = ['Password_hash', 'Hint_question', 'Answer', 'Retailer_id'];
  try {
    user['Password_hash'] = await bcrypt.hash(user.password, 10);
    await db.query(sql, [[fields.map(col => user[col])]]);
  } catch (error) {
    return Promise.reject(error);
  }
}
else {
  const sql = `
    INSERT INTO User_Accounts
    (Password_hash, Hint_question, Answer, Retailer_id) VALUES ?
  `;
  const fields = ['Password_hash', 'Hint_question', 'Answer', 'Retailer_id'];
  try {
    user['Password_hash'] = await bcrypt.hash(user.password, 10);
    await db.query(sql, [[fields.map(col => user[col])]]);
  } catch (error) {
    return Promise.reject(error);
  }
}
};

const saveHintq = async (id, obj, type) => {
  if(type=='retailer') {
  const sql = 'UPDATE User_Accounts SET ? WHERE Retailer_id = ?';
  await db.query(sql, [obj, id]);
  }
  else {
    const sql = 'UPDATE User_Accounts SET ? WHERE Supplier_id = ?';
  await db.query(sql, [obj, id]);
  }
};

export default {
  verifyPassword,
  verifyById,
  changePassword,
  findHintQ,
  verifyAnswer,
  add,
  saveHintq
};
