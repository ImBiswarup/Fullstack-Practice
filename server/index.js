require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const app = express();
const port = process.env.PORT;
const DBUrl = process.env.DB_URL;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect(DBUrl)
    .then(() => console.log('Connected to DB successfully'))
    .catch(err => console.error('Error connecting to DB:', err));

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['CUSTOMER', 'ADMIN'],
        default: 'CUSTOMER'
    },
}, { timestamps: true });

userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

const userModel = mongoose.model('User', userSchema);

const textSchema = new mongoose.Schema({
    text: {
        type: String,
    },
}, { timestamps: true });

const TextModel = mongoose.model('Text', textSchema);


app.post('/', async (req, res) => {
    const { text } = req.body;

    try {
        const storedInfo = await TextModel.create({ text });
        res.json({ message: 'Data stored successfully' });
    } catch (error) {
        console.error('Error storing data:', error);
        res.status(500).json({ error: 'Error storing data' });
    }
});

const generateAuthToken = (user) => {
    const payload = {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
};

app.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ msg: "User already exists" });
        }
        const user = await userModel.create({ email, password, name });

        const token = generateAuthToken(user);
        console.log('token: ', token);

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({ msg: "User signed in successfully", success: true, user, token });
    } catch (error) {
        res.status(500).json({ msg: "User signed in failed" });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ msg: 'Invalid password' });
        }

        res.status(200).json({ msg: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

app.get('/', async (req, res) => {
    try {
        const posts = await TextModel.find({});
        res.json({ posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Error fetching posts' });
    }
});
app.get('/users', async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
