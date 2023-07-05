import { connectDB } from "../../../../server/mongodb";
import { Ticket } from "../../../models";
// currency of US dollar
const ticketDict = {
  isSingleUsePass: { price: 3, duration: 1095 },
  isDayPass: { price: 9, duration: 1 },
  isMonthPass: { price: 95, duration: 30 },
  isYearPass: { price: 695, duration: 365 },
};

export default async function handler(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .send({ success: "false", message: "Only POST requests allowed" });
  }

  const body = req.body;
  await connectDB();

  try {
    // check which type of the thing is
    let type = typeCheck(body);
    const chosenTicket = ticketDict[type];

    // Handle expired date
    const purchase = new Date();
    const expire = new Date(purchase); // Create a new date object based on purchase date
    expire.setDate(purchase.getDate() + chosenTicket.duration); // Calculate the expired date

    // default body
    let newBody = {
      user: body.user,
      datePurchased: purchase,
      expirationDate: expire,
      ticketPrice: chosenTicket.price,
    };
    // Create a new ticket with defalt value
    const newTicket = new Ticket(newBody);

    newTicket[type] = true;

    // Save new ticket to the db
    await newTicket.save();

    return res.status(200).json({
      success: true,
      message: "Successfully add ticket to the database",
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

// const ticketValidation = (data) => {
//   const { passType } = data;
//   if (!passType) {
//     return { isValid: false, message: "Pass type field is required." };
//   } else if (!ticketDict.hasOwnProperty(passType)) {
//     return {
//       isValid: false,
//       message:
//         "Please enter a valid pass type such as isSingleUsePass, isDayPass, isMonthPass or isYearPass",
//     };
//   } else {
//     return { isValid: true, type: "ticket is valid" };
//   }
// };
