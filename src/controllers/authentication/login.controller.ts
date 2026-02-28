// // controllers/userAuth.controller.ts
// import User from "../../model/authmodel/login.model";
// import { signToken } from "../../utils/jwt";
// import {Request, Response, NextFunction} from "express";
// import { AppError } from "../../middlewares/errorHandler";
// import { StatusCodes } from "http-status-codes";

// export const userSignup = async (req: Request, res: Response,next:NextFunction) => {
//   try {
//     const { name, email, password } = req.body;

//     if (await User.findOne({ email })) {
//       throw new AppError("Email already exists", StatusCodes.CONFLICT);
//     }

//     const user = await User.create({ name, email, password });
//   //   const token = signToken({ id: user._id, role: "user" });

//   //  res.cookie("token", token, {
//   //     httpOnly: true,
//   //     secure: process.env.NODE_ENV === "production",
//   //     sameSite: "strict",
//   //     maxAge: 24 * 60 * 60 * 1000
//   //   });


//     res.status(201).json({
//       success: true,
 
//       user: { id: user._id, email: user.email }
//     });
//   } catch (e) {
//     next(e);
//   }
// };

// export const userLogin = async (req: Request, res: Response,next:NextFunction) => {
//   try {
//     const { email, password } = req.body;

//    const user = await User.findOne({ email }).select("+password");

// if (!user || !(await user.comparePassword(password))) {
//   throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
// }


//     const token = signToken({ id: user._id, role: "user" });
     
//         res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000
//     });

       
//     res.json({
//       success: true,
//       token
     
//     });
//   } catch (e) {
//     next(e);
//   }
// };

// export const getUserById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findById(id).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: user,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Invalid user ID",
//     });
//   }
// };


// controllers/userAuth.controller.ts

import User from "../../model/authmodel/login.model";
import { signToken } from "../../utils/jwt";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../middlewares/errorHandler";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

/* ============================= */
/*         USER SIGNUP           */
/* ============================= */

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Basic Validation
    if (!name || !email || !password) {
      throw new AppError(
        "Name, email and password are required",
        StatusCodes.BAD_REQUEST
      );
    }

    if (password.length < 6) {
      throw new AppError(
        "Password must be at least 6 characters",
        StatusCodes.BAD_REQUEST
      );
    }

    // ✅ Check existing user
    if (await User.findOne({ email })) {
      throw new AppError("Email already exists", StatusCodes.CONFLICT);
    }

    const user = await User.create({ name, email, password });

    res.status(StatusCodes.CREATED).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (e) {
    next(e);
  }
};

/* ============================= */
/*          USER LOGIN           */
/* ============================= */

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      throw new AppError(
        "Email and password are required",
        StatusCodes.BAD_REQUEST
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError(
        "Invalid credentials",
        StatusCodes.UNAUTHORIZED
      );
    }

    const token = signToken({
      id: user._id,
      role: "user",
    });

    // ✅ Secure Cookie Settings
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
});

    res.status(StatusCodes.OK).json({
      success: true,
      token,
    });
  } catch (e) {
    next(e);
  }
};

/* ============================= */
/*        GET USER BY ID         */
/* ============================= */

export const getUserById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    // ✅ Validate Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
    });
  }
};