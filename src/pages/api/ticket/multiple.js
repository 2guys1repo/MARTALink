import { connectDB } from "../../../../server/mongodb";
import { Ticket } from "../../../../server/mongodb/models";

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
  // console.log(ticketsArr);
  try {
    ticketsArr.forEach(async (body) => {
      // get the general information for the ticket
      let type = typeCheck(body);
      const chosenTicket = ticketDict[type];

      // business logic for expired date
      const purchase = new Date();
      const expire = new Date(purchase);
      expire.setDate(purchase.getDate() + chosenTicket.duration);

      let newBody = {
        user: body.user,
        datePurchased: purchase,
        expirationDate: expire,
        ticketPrice: chosenTicket.price,
      };
      // create a new default ticket
      const newTicket = new Ticket(newBody);

      // modify the new generated ticket based on the passed info
      newTicket[type] = true;

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
}
const typeCheck = (data) => {
  const { isSingleUsePass, isDayPass, isMonthPass, isYearPass } = data;
  if (isSingleUsePass) {
    return "isSingleUsePass";
  } else if (isDayPass) {
    return "isDayPass";
  } else if (isMonthPass) {
    return "isMonthPass";
  } else if (isYearPass) {
    return "isYearPass";
  }
};
