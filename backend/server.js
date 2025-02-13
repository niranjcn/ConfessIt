import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Schemas
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const ConfessionSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: String, required: true },
    message: { type: String, required: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);
const Confession = mongoose.model("Confession", ConfessionSchema);

// Middlewares
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ error: "Access denied" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        
        if (user.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ error: "Admin access required" });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Routes
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ error: "Email exists" });

        const user = new User({
            username,
            email,
            password: await bcrypt.hash(password, 10)
        });
        await user.save();
        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({
            token,
            isAdmin: user.email === process.env.ADMIN_EMAIL,
            email: user.email,
            username: user.username
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/userpanel", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Routes
app.get("/admin/users", verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/admin/confessions", verifyToken, isAdmin, async (req, res) => {
    try {
        const confessions = await Confession.find()
            .populate("sender", "username email")
            .lean();
        res.json(confessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/admin/confessions/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        await Confession.findByIdAndDelete(req.params.id);
        res.json({ message: "Confession deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/refresh-token", verifyToken, (req, res) => {
    const newToken = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { 
        expiresIn: "1h" 
    });
    res.json({ token: newToken });
});

app.listen(5000, () => console.log("Server running on port 5000"));