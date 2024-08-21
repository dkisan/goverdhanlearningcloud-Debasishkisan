const dbConnect = require('../util/dbConnect')
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'sha256code'


exports.getAllUsers = async (req, res) => {
    const token = req.headers.authorization
    const uid = jwt.verify(token, SECRET_KEY).uid
    const query = `SELECT name,email FROM users WHERE id NOT IN(${uid})`;
    const ownquery = `SELECT name FROM users WHERE id = ${uid}`;
    try {
        const [users] = await dbConnect.execute(query)
        const [name] = await dbConnect.execute(ownquery)
        res.status(200).json({ users, name })
    } catch (err) {
        res.status(500).json({ message: 'Some Error Occured' })
    }
};


exports.postSendChat = async (req, res) => {
    const token = req.headers.authorization
    const uid = jwt.verify(token, SECRET_KEY).uid
    const { recipientEmail, message } = req.body;
    const queryGetIds = ` SELECT id FROM users WHERE email = ?`;
    const query = `INSERT INTO chats (sender_id, recipient_id, message) VALUES (?, ?, ?)`;
    try {
        const [recipient_id] = await dbConnect.execute(queryGetIds, [recipientEmail])
        const [data] = await dbConnect.execute(query, [uid, recipient_id[0].id, message])
        res.status(200).json(data)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: 'Some Error Occured' })
    }
};


exports.getChats = async (req, res) => {
    const token = req.headers.authorization
    const uid = jwt.verify(token, SECRET_KEY).uid
    const recipientEmail = req.params.recipientemail;
    const ownquery = `SELECT email FROM users WHERE id = ${uid}`;
    const queryGetIds = ` SELECT id FROM users WHERE email = ?`;
    const queryGetChats = `SELECT * FROM chats
    WHERE (sender_id = ? AND recipient_id = ?)
    OR (sender_id = ? AND recipient_id = ?)
    ORDER BY created_at ASC`;
    try {
        // const [senderEmail] = await dbConnect.execute(ownquery, [uid])
        const [recipient_id] = await dbConnect.execute(queryGetIds, [recipientEmail])
        const [data] = await dbConnect.execute(queryGetChats, [uid, recipient_id[0].id, recipient_id[0].id, uid])
        const msgs = []
        data.filter(d => {
            const senderemail = d.sender_id === uid ? 'sender' : 'receiver';
            // const senderemail = d.sender_id === uid ? senderEmail : recipientEmail;
            msgs.push(
                {
                    role: senderemail,
                    message: d.message
                }
            )

        })
        res.status(200).json(msgs)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: 'Some Error Occured' })
    }
};

exports.getSingleUser = async (req, res) => {
    const token = req.headers.authorization
    const uid = jwt.verify(token, SECRET_KEY).uid
    const query = `SELECT * FROM users WHERE id = ?`;
    try {
        const [data] = await dbConnect.execute(query, [uid])
        const responseData = data.map(({ id, password, ...rest }) => rest)
        res.status(200).json(responseData)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: 'Some Error Occured' })
    }

}


exports.postUpdateUser = async (req, res) => {
    const { name, email, phoneno, role } = req.body;
    try {
        const query = `UPDATE users SET name = ?, phoneno = ?, role = ? WHERE email = ?`;
        const [data] = await dbConnect.execute(query, [name, phoneno, role, email]);

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Some Error Occured' });
    }
}


exports.deleteUser = async (req, res) => {
    const { email } = req.body;
    try {
        const queryChat = `DELETE FROM chats WHERE sender_id = (SELECT id FROM users WHERE email = ?)`;
        await dbConnect.execute(queryChat, [email]);

        const queryChatReceipient = `DELETE FROM chats WHERE recipient_id = (SELECT id FROM users WHERE email = ?)`;
        await dbConnect.execute(queryChatReceipient, [email]);

        const query = `DELETE FROM users WHERE email = ?`;
        const [data] = await dbConnect.execute(query, [email]);

        res.status(200).json({ message: 'User Deleted successfully' });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Some Error Occured' });
    }
}