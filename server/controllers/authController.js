const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.postSignin = async (req, res, next) => {
  const {name, email, password, role} = req.body;

  try {
    const exsitUser = await userModel.findOne({email: email});
    if (exsitUser) {
      const error = new Error(
        'Eamil already exist, please pick another email!'
      );
      res.status(409).json({
        error: 'Eamil already exist, please pick another email! ',
      });
      error.statusCode = 409;
      throw error;
    } else {
      let hashedPassword = bcrypt.hashSync('password', 10);
      const user = new userModel({
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      });
      const result = await user.save();
      res.status(200).json({
        message: 'User created',
        user: user,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const {email, password} = req.body;

  try {
    const user = await userModel.findOne({email: email});

    if (!user) {
      const error = new Error('user with this email not found!');
      error.statusCode = 401;
      throw error;
    }

    const comparePassword = bcrypt.compare(password, user.password);

    if (!comparePassword) {
      const error = new Error('password is not match!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({userId: user.id}, 'expressnuxtsecret', {
      expiresIn: '200m',
    });
    res.status(200).json({user: user, token: token});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  let userId = req.userId;
  const user = await userModel.findOne({id: userId});
  res.status(200).json({
    user: {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
    },
  });
};
