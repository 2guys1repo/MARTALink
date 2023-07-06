import { connectDB } from "../../../../server/mongodb";
import { Payment, User } from "../../../../server/mongodb/models";
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

export default async function handler(req, res) {
  if (req.method != "GET") {
    return res
      .status(400)
      .send({ success: false, message: "Only GET requests allowed" });
  }

  await connectDB();

  const { userId } = req.query;

  try {
    const user = new ObjectId(userId);
    const payments = await Payment.find({ user: user });
    if (!payments) {
      return res.status(400).json({
        success: false,
        message: "Payments of the user not found",
      });
    }
    return res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payments of the user not found",
    });
  }
}
