// // controllers/adminAuth.controller.ts
// import { Request, Response, NextFunction } from "express";
// import { StatusCodes } from "http-status-codes";

// import Admin, { IAdmin } from "../../model/authmodel/admin.model";
// import { signToken } from "../../utils/jwt";
// import { AppError } from "../../middlewares/errorHandler";



// export const adminLogin = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { email, password } = req.body;

//     // 1️⃣ Find admin WITH password
//     const admin = await Admin.findOne({ email }).select("+password");

//     // 2️⃣ Invalid credentials
//     if (!admin || !(await admin.comparePassword(password))) {
//       throw new AppError(
//         "Invalid admin credentials",
//         StatusCodes.UNAUTHORIZED
//       );
//     }

//     // 3️⃣ Generate JWT
//     const token = signToken({
//       id: admin._id,
//       role: "admin",
//     });

//     // 4️⃣ Set HTTP-only cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//       maxAge: 60 * 60 * 1000,
//     });

//     // 5️⃣ Remove password safely
//     const adminObj = admin.toObject();
//     const { password: _pw, ...adminData } = adminObj;

//     // 6️⃣ Send response ONCE
//     res.status(StatusCodes.OK).json({
//       success: true,
//       token: token,
//       data: adminData,
      
//     });
//   } catch (error) {
//     next(error);
//   }
// };






// // import { Request, Response, NextFunction } from "express";
// // import Admin from "../models/adminModel";
// // // import { StatusCodes } from "http-status-codes";
// // import jwt from "jsonwebtoken";
// // import { AppError } from "../utils/AppError";

// /* =====================================================
//    CREATE / SETUP ADMIN (ONE TIME)
// ===================================================== */
// export const createAdmin = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const email="admin@gmail.com";
//       const password="admin1234"

//     if (!email || !password) {
//       throw new AppError(
//         "Email and password are required",
//         StatusCodes.BAD_REQUEST
//       );
//     }

//     // 🔍 check existing admin
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       throw new AppError(
//         "Admin already exists",
//         StatusCodes.CONFLICT
//       );
//     }

//     // ✅ create admin (password auto-hash via pre-save)
//     const admin = await Admin.create({
//       email,
//       password,
//       role: "admin",
//     });

//     res.status(StatusCodes.CREATED).json({
//       success: true,
//       message: "Admin created successfully",
//       data: {
//         id: admin._id,
//         email: admin.email,
//         role: admin.role,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };



// controllers/adminAuth.controller.ts

import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import Admin, { IAdmin } from "../../model/authmodel/admin.model";
import { signToken } from "../../utils/jwt";
import { AppError } from "../../middlewares/errorHandler";

/* =====================================================
   ADMIN LOGIN
===================================================== */
export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    /* ================= INPUT VALIDATION ================= */
    if (!email || !password) {
      throw new AppError(
        "Email and password are required",
        StatusCodes.BAD_REQUEST
      );
    }

    /* ================= FIND ADMIN ================= */
    const admin = await Admin.findOne({ email }).select("+password");

    /* ================= INVALID CREDENTIALS ================= */
    if (!admin || !(await admin.comparePassword(password))) {
      throw new AppError(
        "Invalid admin credentials",
        StatusCodes.UNAUTHORIZED
      );
    }

    /* ================= ACCOUNT STATUS CHECK ================= */
    if ((admin as any).isBlocked) {
      throw new AppError(
        "Admin account is blocked",
        StatusCodes.FORBIDDEN
      );
    }

    /* ================= GENERATE JWT ================= */
    const token = signToken({
      id: admin._id,
      role: "admin",
    });

    /* ================= SECURE COOKIE ================= */
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
     sameSite: "none",  
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    /* ================= REMOVE PASSWORD ================= */
    const adminObj = admin.toObject();
    const { password: _pw, ...adminData } = adminObj;

    /* ================= RESPONSE ================= */
    res.status(StatusCodes.OK).json({
      success: true,
      token,
      data: adminData,
    });

  } catch (error) {
    next(error);
  }
};

/* =====================================================
   CREATE / SETUP ADMIN (SECURE VERSION)
===================================================== */
export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /* ================= PRODUCTION PROTECTION ================= */
    if (process.env.NODE_ENV === "production") {
      throw new AppError(
        "Admin creation disabled in production",
        StatusCodes.FORBIDDEN
      );
    }

    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(
        "Email and password are required",
        StatusCodes.BAD_REQUEST
      );
    }

    /* ================= PASSWORD POLICY ================= */
    if (password.length < 8) {
      throw new AppError(
        "Password must be at least 8 characters",
        StatusCodes.BAD_REQUEST
      );
    }

    /* ================= CHECK EXISTING ================= */
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new AppError(
        "Admin already exists",
        StatusCodes.CONFLICT
      );
    }

    /* ================= CREATE ADMIN ================= */
    const admin = await Admin.create({
      email,
      password,
      role: "admin",
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Admin created successfully",
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    next(error);
  }
};
