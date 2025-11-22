const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require('../services/auth');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        // Salt is required, but we set it in pre-save
    },
    password: {
        type: String,
        required: true
    },
    profileURL: {
        type: String,
        default: "/images/userAvatar.png",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });

// --- FIXED MIDDLEWARE ---
userSchema.pre("save", function (next) {
    const user = this;

    // 1. If password isn't modified, call next() and return immediately
    if (!user.isModified("password")) {
        return next(); 
    }

    // 2. Generate Salt (use 'hex')
    const salt = randomBytes(16).toString('hex'); // Increased to 16 bytes for better security

    // 3. Hash the password using the salt
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static("matchPasswordAndGenerateToken", async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    // Re-hash the provided password with the saved salt
    const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest('hex');

    // Compare
    if (hashedPassword !== userProvidedHash) {
        throw new Error("Incorrect password");
    }

    // Generate Token
    const token = createTokenForUser(user);
    return token;
});

const User = model('user', userSchema);

module.exports = User;