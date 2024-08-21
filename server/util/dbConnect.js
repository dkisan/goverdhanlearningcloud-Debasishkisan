const mysql = require('mysql2/promise')

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mysqlroot',
  database: 'assignmentdb'
})

const queryCreateTable = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phoneno VARCHAR(20),
    role VARCHAR(100),
    password VARCHAR(255),
    PRIMARY KEY(id) )`;

const queryCreateChatTable = `CREATE TABLE IF NOT EXISTS chats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  recipient_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (recipient_id) REFERENCES users(id)
)`;

connection.execute(queryCreateTable)
  .then(() => {
    connection.execute(queryCreateChatTable);
  })
  .catch(err => {
    console.log(err.message)
  })

module.exports = connection;


