// DYNAMIC ROUTING
import { connectDB } from "../../../../server/mongodb";
import { User } from "../../../../server/mongodb/models";
export default async function handler(req, res) {
  if (req.method != "GET") {
    return res
      .status(400)
      .send({ success: false, message: "Only GET requests allowed" });
  }
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
