require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const multer = require('multer');


const app = express();

app.use(express.json());
const port = process.env.PORT;
const DBUrl = process.env.DB_URL;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
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

const fileSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
    },
});

const FileModel = mongoose.model('File', fileSchema);

// const generateAuthToken = (user) => {
//     const payload = {
//         user: {
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role
//         }
//     };

//     const token = jwt.sign(payload, process.env.JWT_SECRET);
//     return token;
// };

// const verifyAuthToken = (token) => {
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         return decoded;
//     } catch (error) {
//         // If verification fails, you can handle the error here
//         console.error('Token verification failed:', error.message);
//         return null;
//     }
// };

// // Example usage:
// const token = 'your_generated_token_here';
// const decodedToken = verifyAuthToken(token);
// if (decodedToken) {
//     console.log('Token verified successfully:', decodedToken);
// } else {
//     console.log('Token verification failed.');
// }

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


const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     cb(null, './public/uploads')
    // },
    filename: function (req, file, cb) {
        const originalName = file.originalname; // Get the original filename
        const extension = originalName.split('.').pop(); // Get the file extension
        const uniqueSuffix = Date.now(); // Add a timestamp to make the filename unique
        const newFilename = `${originalName}-${uniqueSuffix}.${extension}`; // Construct the new filename
        cb(null, newFilename); // Pass the new filename to multer
    }
});


const upload = multer({ storage: storage })



app.post('/uploads', upload.single('image'), async function (req, res, next) {
    try {
        console.log('req.body: ', req.body);
        console.log('req.file: ', req.file);

        // Create a new document in the FileModel collection with the image path
        const newPost = await FileModel.create({
            imageUrl: req.file.path,
        });
        console.log(newPost);

        res.json({ msg: "Image uploaded successfully", imageUrl: req.file.path });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Error uploading image' });
    }
});

app.get('/', async (req, res) => {
    try {
        const posts = await TextModel.find({});
        const images = await FileModel.find({});

        // Send both posts and images data in the response
        res.json({ posts, images });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
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
