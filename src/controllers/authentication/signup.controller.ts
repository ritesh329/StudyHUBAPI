import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../model/authmodel/login.model";
import validator from "validator";

/**
 * @desc    User Signup / Register
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signupUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    /* ============================= */
    /* 1️⃣ Validate Input            */
    /* ============================= */

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Name, email and password are required",
      });
      return;
    }

    // Trim inputs (prevent space attack)
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Email validation
    if (!validator.isEmail(trimmedEmail)) {
      res.status(400).json({
        message: "Invalid email format",
      });
      return;
    }

    // Strong password check
    if (password.length < 6) {
      res.status(400).json({
        message: "Password must be at least 6 characters",
      });
      return;
    }

    /* ============================= */
    /* 2️⃣ Check if user exists      */
    /* ============================= */

    const existingUser = await User.findOne({ email: trimmedEmail });

    if (existingUser) {
      res.status(409).json({
        message: "User already exists with this email",
      });
      return;
    }

    /* ============================= */
    /* 3️⃣ Hash password             */
    /* ============================= */

    const salt = await bcrypt.genSalt(12); // 🔥 stronger salt rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    /* ============================= */
    /* 4️⃣ Create user               */
    /* ============================= */

    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
    });

    /* ============================= */
    /* 5️⃣ Success Response          */
    /* ============================= */

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : "Server error",
    });
  }
};

export default signupUser;