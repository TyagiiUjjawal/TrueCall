const express = require("express");
const app = express();
const port = 4000;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = "4535j3k3bkbjk2b3kj42b4kjb";

app.use(express.json());
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://yasharora1808:VAOfVcM7e6gXigLP@cluster0.e6is5gc.mongodb.net/TrueCall?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// app.post("/saveCallLogs")
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  console.log("====================================");
  console.log(username, password);
  console.log("====================================");
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  console.log("====================================");
  console.log(username, password);
  console.log("====================================");
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, secretKey, { expiresIn: "1d" });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
