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
    .catch(err => console.error("MongoDB Connection Error:", err));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }
});

const ConfessionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    likes: { type: Number, default: 0 }
});

const User = mongoose.model("User", UserSchema);
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
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

// **Admin Authentication**
app.post("/admin/login", (req, res) => {
    const { password } = req.body;

    if (password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.json({ message: "Admin login successful", token });
    } else {
        res.status(403).json({ error: "Unauthorized access" });
    }
});

// **Post Confession**
app.post("/confessions", verifyToken, async (req, res) => {
    const { text, receiver } = req.body;
    
    try {
        const newConfession = new Confession({ text, sender: req.user.id, receiver });
        await newConfession.save();
        res.status(201).json({ message: "Confession submitted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// **Get All Confessions for Admin**
app.get("/admin/confessions", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Unauthorized" });

    try {
        const confessions = await Confession.find();
        res.json(confessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// **Get Confessions for Normal Users (Hides Sender)**
app.get("/confessions", async (req, res) => {
    try {
        const confessions = await Confession.find().select("-sender");
        res.json(confessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// **Like a Confession**
app.post("/confessions/:id/like", async (req, res) => {
    try {
        const confession = await Confession.findById(req.params.id);
        if (!confession) return res.status(404).json({ error: "Confession not found" });

        confession.likes += 1;
        await confession.save();
        res.json({ message: "Confession liked", likes: confession.likes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// **Delete Confession (Admin Only)**
app.delete("/confessions/:id", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Unauthorized" });

    try {
        await Confession.findByIdAndDelete(req.params.id);
        res.json({ message: "Confession deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// **Get Leaderboard (Top 5 Most Liked Confessions)**
app.get("/leaderboard", async (req, res) => {
    try {
        const topConfessions = await Confession.find().sort({ likes: -1 }).limit(5);
        res.json(topConfessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
