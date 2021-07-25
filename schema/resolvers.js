// Fake Database to test GraphQL
const { users } = require('../fakeData');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

// User Resolvers

// Register a new user
const register = async (parent, args) => {
  // Validate Field Input
  if (!args.username || !args.email || !args.password) {
    throw new Error('All Fields Are Required');
  }

  // Validate Password Length
  if (args.password.length < 8 || args.password.length > 32) {
    throw new Error('Password must be between 8 and 32 characters long');
  }

  try {
    // Send Error if Email Exists in DB
    const foundEmail = await db.User.findOne({ email: args.email });
    if (foundEmail) {
      throw new Error(
        'Email address has already been registered. Please try again'
      );
    }

    // Send Error If Username Exists in DB
    const foundUsername = await db.User.findOne({ username: args.username });
    if (foundUsername) {
      throw new Error('Username has already been registered. Please try again');
    }

    // CREATE SALT FOR HASH
    const salt = await bcrypt.genSalt(10);
    // HASH USER PASSWORD
    const hash = await bcrypt.hash(args.password, salt);
    // CREATE USER WITH HASHED PASSWORD
    const newUser = await db.User.create({ ...args, password: hash });
    return newUser;
  } catch (error) {
    console.log(error);
    if (error) {
      throw new Error(error);
    } else {
      throw new Error('Something went wrong. Please try again');
    }
  }
};

// Returns a list of all users
const getAllUsers = () => {
  return users;
};

// Resolvers for GraphQL
const resolvers = {
  Query: {
    getAllUsers,
  },
  Mutation: {
    register,
  },
};

module.exports = { resolvers };
