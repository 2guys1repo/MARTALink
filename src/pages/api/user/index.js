import { connectDB } from "../../../../server/mongodb";
import { User } from "../../../models";

export default async function handler(req, res) {
  await connectDB();

  try {
    const allUsers = await User.find({});
    return res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}
