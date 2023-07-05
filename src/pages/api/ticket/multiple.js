import { connectDB } from "../../../../server/mongodb";
import { Ticket } from "../../../models";

// currency of US dollar
const ticketDict = {
  isSingleUsePass: { price: 3, duration: 1095 },
  isDayPass: { price: 9, duration: 1 },
  isMonthPass: { price: 95, duration: 30 },
  isYearPass: { price: 695, duration: 365 },
};

export default async function hangdler(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .send({ success: "false", message: "Only POST requests allowed" });
  }

  const body = req.body;
  await connectDB();

  const { ticketsArr } = body;
  console.log(ticketsArr);
  try {
    ticketsArr.forEach(async (body) => {
      // get the general information for the ticket
      const { user, passType } = body;

      // create a new default ticket
      const newTicket = new Ticket({
        user: user,
        expirationDate: new Date(),
        ticketPrice: 0,
      });

      // business logic for expired date
      const lookUp = ticketDict[passType];
      const purchase = newTicket.datePurchased;
      const expire = new Date(purchase);
      expire.setDate(purchase.getDate() + lookUp.duration);

      // modify the new generated ticket based on the passed info
      newTicket.expirationDate = expire;
      newTicket.ticketPrice = lookUp.price;
      newTicket[passType] = true;

      //save the new ticket to the database
      await newTicket.save();
    });

    return res.status(200).json({
      success: true,
      message: "Successfully add tickets to the database",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
  //   let validation = ticketsValidation(body);
}
