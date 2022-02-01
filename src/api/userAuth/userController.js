import sharp from "sharp";
import userModel from "../../model/userModel.js";
import verificationEmailTokenModel from "../../model/veificationEmailToken.js";
import {
  sendWelcomeMail,
  sendCancelationMail,
  sendRecoverPasswordMail,
  resetPasswordMail,
} from "../../emails/sendGrid.js";
import bcrypt from "bcryptjs";
import responses from "../../helper/responses.js";
import { generateConfirmationToken } from "../../helper/emailConfirmationToken.js";
// create a new user
export const handleCreateUser = async (req, res) => {
  const { name, age, email, password } = req.body;
  try {
    const newUser = userModel({ name, age, email, password });
    const EmailToken = await generateConfirmationToken(newUser);
    console.log(EmailToken);
    await newUser.save();
    const link = `http://${req.headers.host}/api/auth/verifyEmail/${EmailToken}`;
    sendWelcomeMail(newUser.email, newUser.name, link);
    const token = await newUser.generateAuthToken();
    return res.status(200).json({ data: newUser, token: token, link });
  } catch (e) {
    if (e.name === "ValidationError") {
      if (e.errors.email) {
        return res.status(400).send({
          message: e.errors.email.message,
        });
      }
      if (e.errors.password) {
        return res.status(400).send({
          message: e.errors.password.message,
        });
      }
      if (e.errors.age) {
        return res.status(400).send({
          message: e.errors.age.message,
        });
      }
    }
    if (e.code === 11000) {
      if (e.keyValue.email) {
        return res.status(400).send({
          message: "Email already exist",
        });
      }
    }
    return res.status(400).send({
      e,
    });
  }
};

// Get List of all Created Users
export const handleGetUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ users });
  } catch (error) {
    return res.status(400).send({
      error,
    });
  }
};

// Update a user profile
export const updateUserProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "age"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
      return res.status(400).send({
        error: "Invalid Updates!",
      });
    } else {
      // const { age, name, email } = req.body;
      // user.age = age ? age : user.age;
      // user.name = name ? name : user.name;
      // user.email = email ? email : user.email;

      updates.forEach((update) => {
        req.user[update] = req.body[update];
      });
      await req.user.save();
      res.status(200).json(req.user);
    }
  } catch (e) {
    if (e.kind === "Number") {
      return res.status(400).send({
        error: "Age Should be a number",
      });
    }
    if (e.name === "ValidationError") {
      if (e.errors.email) {
        return res.status(400).send({
          message: e.errors.email.message,
        });
      }
      if (e.errors.password) {
        return res.status(400).send({
          message: e.errors.password.message,
        });
      }
      if (e.errors.age) {
        return res.status(400).send({
          message: e.errors.age.message,
        });
      }
    }
    res.status(400).json({ e });
  }
};

// Logout a user
export const handleUserLogout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send({ message: "Logged out successfully" });
  } catch (e) {
    res.status(500).send();
  }
};

// Log out all users
export const handleLogoutAllTokens = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send({ message: "Logged out successfully on all devices" });
  } catch (e) {
    res.status(500).send();
  }
};

// Login a user
export const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // check if the request is empty
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }
    const user = await userModel.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.status(200).json({ data: user, token: token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid username or password" });
  }
};

// fetch a user profile
export const handleGetLoggedInUserProfile = async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send();
  }
};

// How to delete a user account from the database
export const handleDeleteProfile = async (req, res) => {
  try {
    sendCancelationMail(req.user.email, req.user.name);
    await req.user.remove();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send();
  }
};

// fetch a single user
export const handleSingleUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await userModel.findOne({ _id });
    await user.populate("userTasks");
    res.status(200).send({ user, tasks: user.userTasks });
  } catch (e) {
    res.status(500).send();
  }
};

// upload a user avatar
export const handleUserAvatar = async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    // req.user.avatar = req.file.buffer;
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
};

// Delete a user avatar
export const handleDeleteUserAvatar = async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send({ message: `Profile pictue has been deleted` });
  } catch (e) {
    res.status(500).send();
  }
};

// Fetch a user profile picture
export const getAUserAvatar = async (req, res) => {
  try {
    // check if the user exists
    // const user = await userModel.findOne({ _id: req.params.id });
    const user = await userModel.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.status(200).send(user.avatar);
  } catch (e) {
    res.status(500).send();
  }
};

export const change_password = async (request, response) => {
  const user = request.user;

  try {
    const { old_password, new_password } = request.body;

    const is_match = await bcrypt.compare(old_password, user.password);
    const same_password = await bcrypt.compare(new_password, user.password);

    if (!is_match)
      return responses.bad_request({
        response,
        message: "Incorrect Password",
        error: "Could not update password",
      });

    if (same_password)
      return responses.bad_request({
        response,
        message: "New Password cannot be the same as the old password",
        error: "Could not update password",
      });

    user.password = new_password;
    await user.save();

    responses.success({
      response,
      message: "Password updated successfully",
      entity: {
        key: "Update Password",
      },
      data: {},
    });
  } catch (error) {
    response.status(500).send({ error: "Internal server error" });
  }
};

export const recoverPassword = async (request, response) => {
  const { email } = request.body;
  if (!email)
    return responses.not_found({
      response,
      message: "Input field cannot be blank",
    });
  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return responses.not_found({
        response,
        message: "No user is associated with that email address",
      });
    const generatePasswordReset = await user.generatePasswordReset();
    console.log(generatePasswordReset);
    const link = `http://${request.headers.host}/api/auth/resetPassword${generatePasswordReset}`;
    sendRecoverPasswordMail(user.email, user.name, link);
    responses.success({
      response,
      message: "Email sent",
      data: link,
    });
  } catch (error) {
    response.status(500).send({ error: "Internal server error", error });
  }
};

export const resetPassword = async (request, response) => {
  const resetPasswordToken = request.params.token;
  const { password, confirmPassword } = request.body;
  try {
    const user = await userModel.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return responses.not_found({
        response,
        message: "Passsword reset token is invalid or has expired",
      });

    if (!password || !confirmPassword)
      return responses.not_found({
        response,
        message: "Please insert an input field",
      });

    const same_password = await bcrypt.compare(password, user.password);

    if (same_password)
      return responses.bad_request({
        response,
        message: "New Password cannot be the same as the old password",
        error: "Could not update password",
      });
    if (password !== confirmPassword)
      return responses.not_found({
        response,
        message: "Password does not match",
      });

    user.password = password;
    user.resetPassword = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    resetPasswordMail(user.email, user.name);
    responses.success({
      response,
      message: "Password has been successful changed",
    });
  } catch (error) {
    response.status(500).send({ error: "Internal server error", error });
  }
};

export const verifyEmail = async (request, response) => {
  try {
    const token = request.params.token;
    const verifyEmailToken = token.split(".")[0];
    const user = token.split(".")[1];
    const is_match = await verificationEmailTokenModel.findOne({
      user,
      verifyEmailToken,
      verifyEmailExpires: { $gt: Date.now() },
    });
    if (!is_match)
      return responses.not_found({
        response,
        message: "Passsword reset token is invalid or has expired",
      });
    const getUser = await userModel.findById({ _id: user });
    getUser.isVerified = true;
    await getUser.save();
    responses.success({
      response,
      message: "Email has been verified",
    });
  } catch (error) {
    console.log(error);
  }
};
