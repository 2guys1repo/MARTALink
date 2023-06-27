// DYNAMIC ROUTING
import { connectDB } from "../../../../server/mongodb";
import { User } from "../../../models";
export default async function handler(req, res) {
  const { id } = req.query;
  await connectDB();
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
