import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import mongoose from "mongoose";

//@desc Auth user/ set token
//route POST /api/user/auth
//@access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const lowercaseEmail = email.toLowerCase();
  const user = await User.findOne({ email: lowercaseEmail });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//@desc Register a user
//route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const lowercaseEmail = email.toLowerCase();
  const userExists = await User.findOne({ email: lowercaseEmail });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email: lowercaseEmail,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Logout a user
//route POST /api/users/logout
//@access Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out" });
});

//@desc Get user profile
//route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc Update user profile
//route PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc Get user infograph
//route GET /api/users/graph
//@access Private
const getInfoGraph = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      infoGraph: user.infoGraph ?? [],
    });
  } else {
    res.status(404);
    throw new Error("Info graph not found");
  }
});
//@desc Create user infograph
//route POST /api/users/graph
//@access Private
const createInfoGraph = asyncHandler(async (req, res) => {
  const { title, dataPoints } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const newinfoGraph = {
    title: title,
    data: dataPoints,
    _id: new mongoose.Types.ObjectId(),
  };
  user.infoGraph.push(newinfoGraph);

  const updatedUser = await user.save();

  res.status(201).json({
    name: updatedUser.name,
    email: updatedUser.email,
    infoGraph: updatedUser.infoGraph,
  });
});

//@desc Update user infograph
//route PUT /api/users/graph
//@access Private
const updateInfoGraph = asyncHandler(async (req, res) => {
  const { infoGraphId, title, data } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find the info graph object by its ID within the user's infoGraph array
  const infoGraphToUpdate = user.infoGraph.find(
    (infoGraph) => infoGraph._id.toString() === infoGraphId
  );

  if (!infoGraphToUpdate) {
    res.status(404);
    throw new Error("Info graph not found");
  }

  // Update the title and dataPoints of the info graph object
  infoGraphToUpdate.title = title;
  infoGraphToUpdate.data = data;

  const updatedUser = await user.save();

  res.status(200).json({
    name: updatedUser.name,
    email: updatedUser.email,
    infoGraph: updatedUser.infoGraph,
  });
});

//@desc Update user infograph
//route PUT /api/users/graph
//@access Private
const deleteInfoGraph = asyncHandler(async (req, res) => {
  const { infoGraphId } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find the info graph object by its ID within the user's infoGraph array
  const infoGraphIndex = user.infoGraph.findIndex(
    (infoGraph) => infoGraph._id.toString() === infoGraphId
  );

  console.log("InfographID:" + infoGraphId);
  console.log(infoGraphIndex);
  if (infoGraphIndex === -1) {
    res.status(404);
    throw new Error("Info graph not found");
  }

  user.infoGraph.splice(infoGraphIndex, 1);

  const updatedUser = await user.save();

  res.status(200).json({
    name: updatedUser.name,
    email: updatedUser.email,
    infoGraph: updatedUser.infoGraph,
  });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getInfoGraph,
  createInfoGraph,
  deleteInfoGraph,
  updateInfoGraph,
};
