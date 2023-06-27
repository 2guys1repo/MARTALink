import { connectDB } from "../../../../server/mongodb";
import { Payment } from "../../../models";

export default async function handler(req, res) {
  await connectDB();

  try {
    const allPayments = await Payment.find({});
    return res.status(200).json(allPayments);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}
