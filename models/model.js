const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.DB_LINK) {
    throw new Error('Missing JWT_KEY in environment variables');
}
const db_link = process.env.DB_LINK;

// Connect to MongoDB Atlas (Online MongoDB)
mongoose
    .connect(db_link)
    .then(() => {
        console.log('[+] Database connected successfully');
    })
    .catch((err) => {
        console.log('[-] Database connection error:', err);
    });

// Define a schema
const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    // iv: {
    //     type: String,
    //     required: true
    // },
    secrets: {
        type: [
            {
                URL: {
                    type: String,
                    default: '',
                },
                USERNAME: {
                    type: String,
                    default: '',
                },
                PASSWORD: {
                    type: String,
                    default: '',
                },
                IV: {
                    type: String,
                    default: ''
                }
            },
        ],
        default: [], // Default value for the secrets field
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
    }
});

// Pre-save hook for hashing password
Schema.pre('save', async function () {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
    }
});

// Create and export the model
const Model = mongoose.model('Model', Schema);

module.exports = Model;
