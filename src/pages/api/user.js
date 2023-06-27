import { connectDB } from "../../../server/mongodb";
import { User } from "../../models";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const reqMethod = req.method;
  const body = req.body;
  await connectDB();
  switch (reqMethod) {
    case "POST":
      // Input validation
      let validation = await userValidation(body);
      if (!validation.isValid) {
        return res
          .status(400)
          .json({ success: false, message: validation.message });
      }
      try {
        body.password = await encryptPassword(body.password);
        const newUser = new User(body);
        await newUser.save();
        // console.log(newUser.password);
        return res.status(200).json({
          success: true,
          message: "Successfully add user to the database",
        });
      } catch (error) {
        // DOAN NAY CAN XEM LAI VALIDATION ERROR O DAU RA
        if ((error.name = "ValidationError")) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid data for user" });
        } else {
          return res
            .status(500)
            .json({ success: false, message: error.message });
        }
      }
    case "GET":
      const query = req.query;
      const { id } = query;
      if (!id) {
        // GET ALL USERS
        const allUsers = await User.find({});
        return res.status(200).json(allUsers);
      } else {
        //   GET A SPECIFIC USER
        try {
          const user = await User.findById(id);
          if (!user) {
            return res
              .status(400)
              .json({ success: false, message: "User not found" });
          }
          return res.status(200).json(user);
        } catch (error) {
          res.status(500).json({ success: false, message: "Server error" });
        }
      }
  }
}
// Encrypt password input
const encryptPassword = async (plainText) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedText = await bcrypt.hash(plainText, salt);
    return encryptedText;
  } catch (error) {
    throw new Error("Error encrypting password");
  }
};

// validate email and password inputs
const userValidation = async (data) => {
  const { email, password } = data;

  // validate email
  if (!email) {
    return { isValid: false, message: "The email field is required." };
  } else {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let userFound = await User.findOne({ email: email });
    if (!regex.test(email)) {
      return { isValid: false, message: "Please enter a valid email address." };
    } else if (userFound) {
      return { isValid: false, message: "Email is already registered." };
    }
  }

  // validate password
  if (!password) {
    return { isValid: false, message: "The Password field is required." };
  } else if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long.",
    };
  }
  return { isValid: true, message: "User and password input are valid." };
};

// {
//   "firstName": "test2",
//   "lastName": "daylatest2",
//   "email": "aloalo4244@gmail.com",
//   "phoneNumber": 4048844376,
//   "password": "thisisatest",
//   "profilePicture": "chua co hinh"
// }
