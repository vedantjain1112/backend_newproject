const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");
const emailValidator = require("email-validator");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const FRONTEND_URL = process.env.FRONTEND_URL;

const sendverifyMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: false,
      requireTLS: true,
      auth: {
        user: "jainvedant1211@gmail.com",
        pass: "bjmoikwiakodifnp",
      },
    });

    const mailOptions = {
      from: "jainvedant1211@gmail.com",
      to: email,
      subject: "Verify your email",
      html: `<p> Hi ${name}, please click <a href="${FRONTEND_URL}/verify?id=${user_id}&token=${emailToken}">here</a> to verify your email.</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent successfully", info.response);
      }
    });
  } catch (error) {
    console.log("Error occurred", error);
  }
};

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!emailValidator.validate(email)) {
      return res.send(error(400, "Invalid email address"));
    }

    if (!email || !password || !name) {
      // return res.status(400).send("All fields are required");
      return res.send(error(400, "All fields are required"));
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      // return res.status(409).send("User already exists");
      return res.send(error(409, "Email already registered"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailToken = crypto.randomBytes(64).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailToken,
      is_verified: false,
    });

    sendverifyMail(name, email, user._id, emailToken);

    const newUser = await User.findById(user._id);

    // return res.status(201).json({
    //   user,
    // });

    return res.send(success(201, "user created successfully"));
  } catch (e) {
    console.log("Error occurred", e);
    // return res.status(500).send("Internal server error");
    return res.send(error(500, "Internal server error"));
  }
};

const verifyMail = async (req, res) => {
  try {
    const { id, token } = req.query;
    const user = await User.findById(id);

    if (!user || user.emailToken !== token) {
      return res.send(error(400, "Invalid verification link"));
    }

    user.is_verified = true;
    user.emailToken = undefined;
    await user.save();

    return res.send(success(200, "Email Verified Successfully"));
  } catch (error) {
    console.log("Error occurred", error);
    return res.send(error(500, "Internal server error"));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!emailValidator.validate(email)) {
      return res.send(error(400, "Invalid email address"));
    }

    if (!email || !password) {
      return res.send(error(400, "All fields are required"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      // return res.status(404).send("User not found");
      return res.send(error(404, "User not registered"));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      // return res.status(403).send("Invalid password");
      return res.send(error(403, "Invalid password"));
    }

    const accessToken = generateAccessToken({
      _id: user._id,
    });

    const refreshToken = generateRefreshToken({
      _id: user._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, { message: "Login successful", accessToken }));
  } catch (e) {
    console.log("Error occurred", e);
    // return res.status(500).send("Internal server error");
    return res.send(error(500, "Internal server error"));
  }
};

//This api will check the refreshToken validity and generate a new access token
const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    // return res.status(401).send("Refresh Token in cookie is required");
    return res.send(error(401, "Refresh Token in cookie is required"));
  }

  const refreshToken = cookies.jwt;
  console.log("Refresh Token : ", refreshToken);

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });
    // return res.status(201).json({ accessToken });

    return res.send(
      success(201, {
        accessToken,
      })
    );
  } catch (e) {
    console.log(e);
    // return res.status(401).send("Invalid Refresh Token");
    return res.send(error(401, "Invalid Refresh Token"));
  }
};

//Internal Functions
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    console.log(token);
    return token;
  } catch (e) {
    console.log("Error occurred", e);
    return null;
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "user logged out"));
  } catch (e) {
    return res.send(error(500), e.message);
  }
};

const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    console.log(token);
    return token;
  } catch (e) {
    console.log("Error occurred", e);
    return null;
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!emailValidator.validate(email)) {
      return res.send(error(400, "Invalid email address"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.send(error(404, "User not found"));
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.forwardemail.net",
      port: 465,
      secure: true,
      auth: {
        user: "bobbie15@ethereal.email",
        pass: "bThbegrZupMREF6yup",
      },
    });
    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: "jainvedant1211@gmail.com",
      to: user.email,
      subject: "Password Reset",
      html: `<p>Hello ${user.name},</p><p>Please click on the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    };

    await transporter.sendMail(mailOptions);

    return res.send(success(200, "Password reset link sent successfully"));
  } catch (e) {
    console.log("Error occurred", e);
    return res.send(error(500, "Internal server error"));
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.send(error(400, "Invalid or expired reset token"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.send(success(200, "Password reset successful"));
  } catch (e) {
    console.log("Error occurred", e);
    return res.send(error(500, "Internal server error"));
  }
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
  verifyMail,
};
