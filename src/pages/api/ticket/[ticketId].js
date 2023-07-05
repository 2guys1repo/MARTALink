import { connectDB } from "../../../../server/mongodb";
import { Ticket } from "../../../models";
const ticketType = [
  "isSingleUsePass",
  "isDayPass",
  "isMonthPass",
  "isYearPass",
];
export default async function handler(req, res) {
  if (req.method != "GET") {
    return res
      .status(400)
      .send({ success: false, message: "Only GET requests allowed" });
  }
  const { ticketId } = req.query;
  await connectDB();
  try {
    const ticketFound = await Ticket.findById(ticketId);
    // "datePurchased expirationDate ticketPrice"
    if (!ticketFound) {
      return res
        .status(400)
        .json({ success: false, message: "Ticket not found" });
    }

    const ret = {
      datePurchased: ticketFound.datePurchased,
      dateExpired: ticketFound.expirationDate,
      ticketPrice: ticketFound.ticketPrice,
      ticketType: "default",
    };

    for (let i = 0; i < ticketType.length; i++) {
      if (ticketFound[ticketType[i]] == true) {
        ret.ticketType = ticketType[i];
      }
    }

    return res.status(200).json(ret);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
