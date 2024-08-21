const dbConnect = require('../util/dbConnect')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'sha256code'

exports.postSignup = async (req, res) => {
    const { name, email, phoneno, role, password } = req.body

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds)
    const query = 'INSERT INTO users (name,email,phoneno,role,password) VALUES (?,?,?,?,?)';
    try {
        await dbConnect.execute(query, [name, email, phoneno, role, hashPassword])
        res.status(201).json({ message: 'User Created Successfully' })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: 'Some Error Occured' })
    }
}


exports.postLogin = async (req, res) => {
    const { email, password, role } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    try {
        const [user] = await dbConnect.execute(query, [email]);

        if (!user || user.length === 0) {
            return res.status(401).json({ message: 'No User Found' });
        }
        if (user[0].role !== role) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        const isValidPassword = await bcrypt.compare(password, user[0].password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ uid: user[0].id }, SECRET_KEY)
        res.status(200).json({ token, message: 'Login Successful' });
    } catch (err) {
        console.log(err, err.message)
        res.status(500).json({ message: 'Some Error Occured' });
    }
};