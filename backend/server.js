import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }
});

const User = mongoose.model("User", UserSchema);

const ConfessionSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    message: { type: String, required: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track users who liked
    createdAt: { type: Date, default: Date.now }
});

const Confession = mongoose.model("Confession", ConfessionSchema);

// **Register Route**
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// **Login Route**
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// **Middleware to Verify Token**
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

// **Protected Route Example (Dashboard)**
app.get("/dashboard", verifyToken, (req, res) => {
    res.json({ message: "Welcome to the dashboard!", user: req.user });
});

// **User Panel Route (Protected)**
app.get("/userpanel", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// **Confession Routes**
app.post("/confessions", verifyToken, async (req, res) => {
    const { recipient, message } = req.body;
    try {
        const newConfession = new Confession({ sender: req.user.id, recipient, message });
        await newConfession.save();
        res.status(201).json({ message: "Confession submitted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/confessions", async (req, res) => {
    try {
        const confessions = await Confession.find().sort({ createdAt: -1 });
        res.json(confessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/confessions/:id/like", verifyToken, async (req, res) => {
    try {
        const confession = await Confession.findById(req.params.id);
        if (!confession) return res.status(404).json({ error: "Confession not found" });

        // Check if the user has already liked the confession
        if (confession.likedBy.includes(req.user.id)) {
            return res.status(400).json({ error: "You have already liked this confession" });
        }

        // Add the user's ID to the likedBy array and increment likes
        confession.likedBy.push(req.user.id);
        confession.likes += 1;
        await confession.save();

        res.json({ message: "Confession liked" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/confessions/top", async (req, res) => {
    try {
        const topConfessions = await Confession.find().sort({ likes: -1, createdAt: -1 }).limit(5);
        res.json(topConfessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));