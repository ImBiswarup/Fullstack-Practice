require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;


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
    token: {
        type: String,
    }
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);

const textSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    createdBy: {
        type: String, // Store only the username
        required: true,
    },
}, { timestamps: true });

const TextModel = mongoose.model('Text', textSchema);

const fileSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
    },

});

const FileModel = mongoose.model('File', fileSchema);

const orderSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },

}, { timestamps: true })

const orderModel = mongoose.model('Order', orderSchema);


// // Example usage:
// const token = 'your_generated_token_here';
// const decodedToken = verifyAuthToken(token);
// if (decodedToken) {
//     console.log('Token verified successfully:', decodedToken);
// } else {
//     console.log('Token verification failed.');
// }


const generateAuthToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
};


const verifyAuthToken = (req, res, next) => {
    const token = (req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ msg: 'Authorization token missing' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ msg: 'Invalid token' });
    }
};



app.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await userModel.create({ email, password: hashedPassword, name });

        const token = generateAuthToken(user);

        user.token = token;
        await user.save();

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({ msg: "User signed in successfully", success: true, user, token });
    } catch (error) {
        console.error('Error during signup:', error);
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

        const token = generateAuthToken(user);

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(200).json({ msg: 'Login successful', user, token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});


app.post('/upload', verifyAuthToken, async (req, res) => {
    try {
        console.log(req.user.name);
        console.log('body: ', req.body);
        const { text } = req.body;
        
        // Create the new text with createdBy as user's ObjectId
        const newText = await TextModel.create({ text, createdBy: req.user.name });
        
        // Populate the createdBy field with the corresponding user's information
        await newText.populate('createdBy');

        console.log(newText);
        res.status(200).json({ newText });
    } catch (error) {
        console.error('Error creating text:', error);
        res.status(500).json({ error: 'Error creating text' });
    }
});








cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    },
});


const upload = multer({ storage: storage })

app.post('/uploads', upload.single('image'), async function (req, res, next) {
    try {
        console.log('req.body: ', req.body);
        console.log('req.file: ', req.file);

        cloudinary.uploader.upload(req.file.path, async (error, result) => {
            if (error) {
                console.error('Error uploading image to Cloudinary:', error);
                return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
            }

            const newPost = await FileModel.create({
                imageUrl: result.secure_url,
            });
            console.log('New post created:', newPost);

            res.json({ msg: "Image uploaded successfully", imageUrl: result.secure_url });
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Error uploading image' });
    }
});

app.post('/order', async (req, res) => {
    const { itemName, quantity, location, destination } = req.body;
    try {
        if (location === destination) {
            return res.status(400).json({ msg: "Source and destination can't be the same" });
        }
        const newOrder = await orderModel.create({ itemName, quantity, location, destination });
        res.status(200).json({ newOrder, msg: 'Order placed successfully' });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ msg: 'Failed to create order' });
    }
});



app.delete('/order/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const deletedOrder = await orderModel.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        res.status(200).json({ msg: 'Order deleted', deletedOrder });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ msg: 'Failed to delete order' });
    }
});


app.get('/', async (req, res) => {
    try {
        const posts = await TextModel.find({}).populate('createdBy');
        const images = await FileModel.find({});
        const users = await userModel.find({});
        const orders = await orderModel.find({});

        res.json({ posts, images, users, orders })
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});


app.get('/orders/:orderId', async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Error fetching order' });
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
