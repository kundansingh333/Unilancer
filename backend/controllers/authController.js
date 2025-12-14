// backend/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ========== EMAIL CONFIGURATION ==========
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ========== HELPER FUNCTION: Generate JWT ==========
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ========== HELPER FUNCTION: Send Email ==========
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Unilancer" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email sending failed:", err);
    throw new Error("Failed to send email");
  }
};

// ========== 1. REGISTER ==========
exports.register = async (req, res) => {
  try {
    const { email, password, name, role, ...otherFields } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    // Validate role-specific fields
    if (role === "student") {
      const { branch, year, section, rollNumber } = otherFields;
      if (!branch || !year || !section || !rollNumber) {
        return res.status(400).json({
          success: false,
          error: "Missing required student fields",
        });
      }

      // Check if roll number already exists
      const existingRoll = await User.findOne({ rollNumber });
      if (existingRoll) {
        return res.status(400).json({
          success: false,
          error: "Roll number already registered",
        });
      }
    }

    if (role === "alumni") {
      const { company, jobTitle, yearOfPassing, domain } = otherFields;
      if (!company || !jobTitle || !yearOfPassing || !domain) {
        return res.status(400).json({
          success: false,
          error: "Missing required alumni fields",
        });
      }
    }

    if (role === "faculty") {
      const { department, designation, employeeId } = otherFields;
      if (!department || !designation || !employeeId) {
        return res.status(400).json({
          success: false,
          error: "Missing required faculty fields",
        });
      }

      // Check if employee ID already exists
      const existingEmployee = await User.findOne({ employeeId });
      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          error: "Employee ID already registered",
        });
      }
    }

    // Create user
    const user = new User({
      email,
      password,
      name,
      role,
      ...otherFields,
    });

    // Generate verification token (link-based, existing logic)
    const verificationToken = user.generateVerificationToken();

    // 🔹 NEW: Generate 6-digit OTP and store hashed version
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.emailVerificationCode = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");
    user.emailVerificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send verification email (kept link + added OTP)
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailHtml = `
      <h2>Welcome to Unilancer, ${name}!</h2>
      <p>Please verify your email using one of the methods below:</p>

      <h3>1. Using OTP</h3>
      <p>Your One-Time Password (OTP) is:</p>
      <p style="
        font-size: 24px;
        letter-spacing: 4px;
        font-weight: bold;
      ">${otp}</p>
      <p>This OTP will expire in <strong>10 minutes</strong>.</p>

      <hr />

      <h3>2. Using Verification Link</h3>
      <p>Or click the link below to verify your email:</p>
      <a href="${verificationUrl}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #5B6AEA;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        margin: 10px 0;
      ">Verify Email</a>
      <p>Or copy this link: ${verificationUrl}</p>
      <p>This link expires in 24 hours.</p>
      ${
        role !== "student"
          ? "<p><strong>Note:</strong> Your account will require admin approval after email verification.</p>"
          : ""
      }
    `;

    await sendEmail(email, "Verify Your Email - Unilancer", emailHtml);

    res.status(201).json({
      success: true,
      message:
        "Registration successful! We've sent an OTP to your email to verify your account.",
      requiresApproval: role !== "student",
      userId: user._id,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Registration failed",
    });
  }
};

// ========== 2. VERIFY EMAIL (TOKEN LINK) ==========
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Verification token is required",
      });
    }

    // Hash the token to match stored version
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired verification token",
      });
    }

    // Update user
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    user.emailVerificationCode = undefined;
    user.emailVerificationCodeExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully!",
      requiresApproval: user.role !== "student" && !user.isApproved,
    });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({
      success: false,
      error: "Email verification failed",
    });
  }
};

// ========== 2b. VERIFY EMAIL BY OTP ==========
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: "Email and OTP are required",
      });
    }

    // Need access to OTP fields (select: false)
    const user = await User.findOne({ email }).select(
      "+emailVerificationCode +emailVerificationCodeExpires"
    );

    if (!user || !user.emailVerificationCode) {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP or user not found",
      });
    }

    // Check expiry
    if (
      !user.emailVerificationCodeExpires ||
      user.emailVerificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        error: "OTP has expired. Please request a new verification.",
      });
    }

    // Hash incoming OTP and compare
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== user.emailVerificationCode) {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP",
      });
    }

    // OTP valid → verify email
    user.emailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationCodeExpires = undefined;

    // Also clean up link-based token if still present
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully!",
      requiresApproval: user.role !== "student" && !user.isApproved,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({
      success: false,
      error: "OTP verification failed",
    });
  }
};

//===========resend otp=========
// ========== X. RESEND EMAIL OTP ==========
exports.resendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    // Find user (we need OTP fields, so select them)
    const user = await User.findOne({ email }).select(
      "+emailVerificationCode +emailVerificationCodeExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        error: "Email is already verified",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before saving
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.emailVerificationCode = hashedOtp;
    user.emailVerificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send OTP email
    const emailHtml = `
      <h2>Your Unilancer Verification Code</h2>
      <p>Hi ${user.name},</p>
      <p>Your email verification code is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This code is valid for 10 minutes.</p>
      <p>If you didn't request this, you can ignore this email.</p>
    `;

    await sendEmail(user.email, "Your Unilancer OTP Code", emailHtml);

    res.json({
      success: true,
      message: "Verification code sent to your email.",
    });
  } catch (err) {
    console.error("Resend Email OTP error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to resend verification code",
    });
  }
};

// ========== 3. LOGIN ==========
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("1. Login Attempt for:", email);

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    console.log("2. User found in DB:", user ? "YES" : "NO");

    if (!user) {
      console.log("--> Error: User not found");
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);

    console.log("3. Password match result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("--> Error: Password mismatch");
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        error: "Please verify your email before logging in",
        needsVerification: true,
      });
    }

    // Check if account is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        error: "Your account has been blocked. Please contact admin.",
      });
    }

    // Check if alumni/faculty account is approved
    if (
      (user.role === "alumni" || user.role === "faculty") &&
      !user.isApproved
    ) {
      return res.status(403).json({
        success: false,
        error: "Your account is pending admin approval",
        needsApproval: true,
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Get public profile
    const userProfile = user.getPublicProfile();

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userProfile,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
};

//======FORGOT PASSWORD OTP=========

// ========== 6b. FORGOT PASSWORD via OTP ==========
exports.forgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Do NOT reveal whether email exists
      return res.json({
        success: true,
        message: "If that email exists, an OTP has been sent",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash and store OTP
    user.resetPasswordCode = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetPasswordCodeExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // Send OTP email
    const emailHtml = `
      <h2>Password Reset OTP</h2>
      <p>Hi ${user.name},</p>
      <p>Your password reset OTP is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail(
      user.email,
      "Your Password Reset OTP - Unilancer",
      emailHtml
    );

    res.json({
      success: true,
      message: "If that email exists, an OTP has been sent",
    });
  } catch (err) {
    console.error("Forgot password OTP error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to process OTP request",
    });
  }
};

//=========RESET PASSWORD OTP=========

// ========== 7b. RESET PASSWORD via OTP ==========
exports.resetPasswordOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Email, OTP, and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email }).select(
      "+resetPasswordCode +resetPasswordCodeExpires"
    );

    if (!user || !user.resetPasswordCode) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired OTP",
      });
    }

    // Check expiry
    if (user.resetPasswordCodeExpires < Date.now()) {
      user.resetPasswordCode = undefined;
      user.resetPasswordCodeExpires = undefined;
      await user.save();
      return res.status(400).json({
        success: false,
        error: "OTP has expired. Please request a new one.",
      });
    }

    // Hash incoming OTP & compare
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== user.resetPasswordCode) {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP",
      });
    }

    // OTP is valid → update password
    user.password = newPassword; // pre-save hook will hash it
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpires = undefined;
    await user.save();

    // Optional: send confirmation email
    const emailHtml = `
      <h2>Password Changed Successfully</h2>
      <p>Hi ${user.name},</p>
      <p>Your password has been changed successfully using OTP.</p>
      <p>If you didn't make this change, contact support immediately.</p>
    `;

    await sendEmail(user.email, "Password Changed - Unilancer", emailHtml);

    res.json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (err) {
    console.error("Reset password OTP error:", err);
    res.status(500).json({
      success: false,
      error: "Password reset via OTP failed",
    });
  }
};

// ========== 4. GET CURRENT USER ==========
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
    });
  }
};

// ========== 5. LOGOUT ==========
exports.logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Logout failed",
    });
  }
};

// ========== 6. FORGOT PASSWORD ==========
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: true,
        message: "If that email exists, a reset link has been sent",
      });
    }

    const resetToken = user.generateResetToken();
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const emailHtml = `
      <h2>Password Reset Request</h2>
      <p>Hi ${user.name},</p>
      <p>You requested to reset your password. Click the link below:</p>
      <a href="${resetUrl}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #5B6AEA;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        margin: 10px 0;
      ">Reset Password</a>
      <p>Or copy this link: ${resetUrl}</p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail(email, "Reset Your Password - Unilancer", emailHtml);

    res.json({
      success: true,
      message: "If that email exists, a reset link has been sent",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to process request",
    });
  }
};

// ========== 7. RESET PASSWORD ==========
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const emailHtml = `
      <h2>Password Changed Successfully</h2>
      <p>Hi ${user.name},</p>
      <p>Your password has been changed successfully.</p>
      <p>If you didn't make this change, please contact us immediately.</p>
    `;

    await sendEmail(user.email, "Password Changed - Unilancer", emailHtml);

    res.json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({
      success: false,
      error: "Password reset failed",
    });
  }
};

// ========== 8. RESEND VERIFICATION EMAIL ==========
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        error: "Email already verified",
      });
    }

    // Generate new token
    const verificationToken = user.generateVerificationToken();

    // NEW: generate new OTP as well
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationCode = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");
    user.emailVerificationCodeExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailHtml = `
      <h2>Verify Your Email</h2>
      <p>Hi ${user.name},</p>

      <h3>1. OTP</h3>
      <p>Your OTP is:</p>
      <p style="
        font-size: 24px;
        letter-spacing: 4px;
        font-weight: bold;
      ">${otp}</p>
      <p>This OTP will expire in 10 minutes.</p>

      <hr />

      <h3>2. Link</h3>
      <p>Or click the link below to verify your email:</p>
      <a href="${verificationUrl}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #5B6AEA;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        margin: 10px 0;
      ">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `;

    await sendEmail(email, "Verify Your Email - Unilancer", emailHtml);

    res.json({
      success: true,
      message: "Verification email sent",
    });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to send verification email",
    });
  }
};

module.exports = exports;
