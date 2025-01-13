"use strict";

// Imports
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const path = require("path");
const Model = require("../models/model");
const { ROLES, USER_KEYS, COOKIES, MESSAGE } = require("../utility/util");

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.JWT_KEY) {
    throw new Error('Missing JWT_KEY in environment variables');
}

const JWT_KEY = process.env.JWT_KEY;

/**
 * Function to verify the authenticity of a user token
 * @param {string} token - The JWT token to verify
 * @returns {string|boolean} - User ID if valid, false otherwise
 */
function is_user_authentic(token) {
    try {
        let payload = jwt.verify(token, JWT_KEY);
        return payload.payload;
    } catch (error) {
        console.log('[-] Error verifying token:', error.message);
        return false;
    }
}

/**
 * Middleware to authorize a user
 * Protects private routes from unauthorized access
 */
const authorize_user = async (req, res, next) => {
    try {
        let token = req.cookies?.login; // Check if token exists in cookies
        let id = is_user_authentic(token);
        if (!id) return res.redirect('/auth/login');

        let user = await Model.findById(id);
        if (user) {
            req.id = id; // Attach user ID to the request object
            next(); // Allow access to the next middleware or route
        } else {
            return res.redirect('/auth/login');
        }
    } catch (error) {
        console.log('[-] Authorization error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const isLoggedIn = (req, res, next) => {
  req.cookies.login? res.redirect('/user'): next();
  return;
}

/**
 * function to validate a user
 * @param {string} role - Role of the user ['user', 'admin']
 * @param {object} data - The user dara to validate
 * @returns {Array} - [boolean, string]
 */
async function validateUserData(role, data) {
  try {
    if (role === ROLES.USER) {
      if (
        !data.name ||
        !data.email ||
        !data.password ||
        !data.confirmPassword
      ) return [false, "An error occurred!"];

      const user = await Model.findOne({
        $or: [
          { [USER_KEYS.email]: data.email }
        ]
      });
      if (user) return [false, "User already exists!"];

      return [true];
    }

    if (role === ROLES.ADMIN) {
      if (
        !data.name ||
        !data.email ||
        !data.password ||
        !data.confirmPassword
      ) return [false, "An error occurred!"];

      const user = await Model.findOne({
        $or: [
          { [USER_KEYS.email]: data.email }
        ]
      });
      if (user) return [false, "User already exists!"];

      return [true];
    }
  } catch (error) {
    console.log("[-] Validation Error:", error);
    return [false, error.message];
  }
}

// Handlers
module.exports = {
  authorize_user,
  isLoggedIn,
  get_signup_page(req, res) {
    if (req.cookies.login) {
      return res.send({ message: "Ongoing session detected!" });
    }
    // res.sendFile(path.join(__dirname, "../views/html/signup.html"));
  },

  get_login_page(req, res) {
    if (req.cookies.login) {
      return res.send({ message: "User already logged in!" });
    }
    res.sendFile(path.join(__dirname, "../views/html/login.html"));
  },

  async signup(req, res) {
    try {
      const role = ROLES.USER; // (update) you can provide roles from req.body
      if (!role) return res.json({ message: "Role is required!" });

      const userData = role === ROLES.ADMIN
        ? { // admin data
            [USER_KEYS.NAME]: req.body.name,
            [USER_KEYS.EMAIL]: req.body.email,
            [USER_KEYS.PASSWORD]: req.body.password,
            [USER_KEYS.CONFIRM_PASSWORD]: req.body.confirmPassword,
          }
        : { // user data
            [USER_KEYS.NAME]: req.body.name,
            [USER_KEYS.EMAIL]: req.body.email,
            [USER_KEYS.PASSWORD]: req.body.password,
            [USER_KEYS.CONFIRM_PASSWORD]: req.body.confirmPassword,
          };

      const [isValid, validationMessage] = await validateUserData(role, userData);
      if (!isValid) return res.json({ message: validationMessage });

      const model = role === ROLES.ADMIN ? Model : Model; // (update) you can add an admin model also
      const user = await model.create(userData);
      if (user) {
        const token = jwt.sign({ payload: user["_id"] }, JWT_KEY);
        res.cookie(COOKIES.LOGIN, token, { maxAge: 86400000, httpOnly: true });
        res.cookie(COOKIES.ROLE, role, { maxAge: 86400000, httpOnly: true });

        // return res.status(200).json({ message: `${role} signed up`, data: user });
        return res.redirect('/user');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      if (req.cookies.login) {
        return res.status(200).send({ message: "User already logged in!" });
      }

      const { role, email, password } = req.body;
      const query = role === ROLES.ADMIN
      ? {
        // admin
        [USER_KEYS.EMAIL]: email
      } : {
        // user
        [USER_KEYS.EMAIL]: email
      };

      const model = role === ROLES.ADMIN ? Model : Model; // (update) you can also add admin model
      const user = await model.findOne(query);
      if (!user) return res.status(404).json({ message: MESSAGE.UserNotFound });

      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const token = jwt.sign({ payload: user["_id"] }, JWT_KEY);
        res.cookie(COOKIES.LOGIN, token, { maxAge: 86400000, httpOnly: true });
        res.cookie(COOKIES.ROLE, role, { maxAge: 86400000, httpOnly: true });

        // return res.status(200).json({ message: `${role} has logged in`, details: user });
        return res.redirect('/user');
      } else {
        return res.status(401).json({ message: "Invalid credentials!" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  logout(req, res) {
    try {
      if (req.cookies.login) {
        res.clearCookie(COOKIES.LOGIN);
        res.clearCookie(COOKIES.ROLE);
      }
      res.redirect("/");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
