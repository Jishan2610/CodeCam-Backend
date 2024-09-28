const dotenv = require("dotenv");
const zod = require("zod");
const User = require("../Db/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


//USER SIGN UP
const signupBody = zod.object({
    username: zod
    .string()
    .email({ message: "Invalid email address." })
    .min(1, { message: "Email is required." }),

  firstName: zod
    .string()
    .min(1, { message: "First name is required." })
    .max(50, {
      message: "First name must be less than or equal to 50 characters.",
    }),

  lastName: zod
    .string()
    .min(1, { message: "Last name is required." })
    .max(50, {
      message: "Last name must be less than or equal to 50 characters.",
    }),

  password: zod
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

const signUp = async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    console.log(req.body)
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  //check if user already exists in db or not
  const existingUser = await User.findOne({
    username: req.body.username,
  });
  console.log(existingUser)
  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken",
    });
  }
  const { username, firstName, lastName, password } = req.body;
  console.log(username+" UN "+ firstName+" fn "+lastName+" ln "+ password+" pd ")
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hashSync(password, salt);
  const newUser = await User.create({
    username,
    firstName,
    lastName,
    password: hashedPassword,
    roomsCreated: [],
    roomsJoined: [],
  });
  const userId = newUser._id;

  //send jwt with response
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  res.status(200).json({
    message: "User created successfully",
    token: token,
  });
};

///<-------------SIGN IN----------------------->>
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

const signIn = async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
//   

  const user = await User.findOne({
    username: req.body.username,
  });
  console.log(user);

  if (!user) {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  console.log(isMatch);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return res.status(200).json({ token: token });
};

///<<--------------UPDATE-------------------->>
const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});
const updateUser = async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
  await User.updateOne({ _id: req.userId }, req.body);
  res.status(200).json({
    message: "Updated Successfully.",
  });
};

///<<-----------Get User(Filtered)--------------->>
const getUser = async (req, res) => {
  const filter = req.query.filter || "";

  const regex = new RegExp(filter, "i"); //"i" in RegExp means case insensitive
  const users = await User.find({
    $or: [{ firstName: regex }, { lastName: regex }],
  });
  res.status(200).json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
};

module.exports = { signUp, signIn, updateUser, getUser };
