import { connectDB } from "../../../../server/mongodb";
import { Payment } from "../../../../server/mongodb/models";

export default async function handler(req, res) {
  if (req.method != "GET") {
    return res
      .status(400)
      .send({ success: false, message: "Only GET requests allowed" });
  }

  await connectDB();

  try {
    const allPayments = await Payment.find({});
    return res.status(200).json(allPayments);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}
