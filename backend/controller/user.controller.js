import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};


// Update current user profile
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { name, email } = req.body;

    const data = {};

    if (name !== undefined) {
      data.name = name?.trim() || null;
    }

    if (email !== undefined) {
      const newEmail = email.trim().toLowerCase();

      if (!newEmail) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty",
        });
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          email: newEmail,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
        });
      }

      data.email = newEmail;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No profile changes provided",
      });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};


// Change password
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const passwordHash = await bcrypt.hash(
      newPassword,
      10
    );

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};


// Delete current account
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


export {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
};