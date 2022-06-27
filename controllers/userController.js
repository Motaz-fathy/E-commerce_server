const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const userController = {};

// signup
userController.Signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    } else if (!validateEmail(email))
      return res.status(400).json({ message: "Invalid emails." });

    const userexists = await User.findOne({ email });
    if (userexists) {
       res.status(404)
      .json({message : 'this email already exists '})
    }
    if (password.length < 6) {
       res
        .status(400)
       .json({ message :"Password must be at least 6 characters."})
    }

    const user = await User.create({
      username,
      email,
      password
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token
      });
    } else {
       res.status(402)
       .json({message : "one of filad is not match "})
    }
  } catch (error) {
    if (error.code === 11000 && error.name === "MongoError") {
      res.status(401).json({ msg: "User already exists" });
    }
  }
};

//login
userController.Login = async (req, res) => {
 
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
      });
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        image : user.image ,
        token
      });
    } else {
      res.status(400).json({message : "user not found "})
    }
};

// Profile 

userController.Profile = async (req ,res) => {
try {
  const user = await User.findById(req.user._id)
  if (user) {
    res.send({
        _id: user._id,
        username: user.username,
        email: user.email,
        image : user.image ,
        token : user.token
    });
  }else {
  res.status(404).json({message : "not Authrized user "})
  }
} catch (error) {
  res.status(404).json({message : "not Authrized user "})
}
}
// UpdateProfile 

userController.UpdateProfile = async (req ,res) => {
  try {
    const user = await User.findById(req.user._id)
    const {username , email , password , image } = req.body
    if (user) {
     user.username = username || user.username ;
     user.email = email || user.email ;
     user.password = password || user.password ;
     user.image = image || user.image 

     res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      image : user.image ,
      token : user.token
     })
  } 
  }catch (error) {
    res.status(404).json({message : "not Authrized user "})
  }
}

const validateEmail = payload => {
  return String(payload)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

module.exports = userController;
