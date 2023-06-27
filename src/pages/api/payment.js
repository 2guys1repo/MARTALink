import { connectDB } from "../../../server/mongodb";
import { Payment, User } from "../../models";

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

export default async function handler(req, res) {
  const reqMethod = req.method;
  const body = req.body;
  await connectDB();

  switch (reqMethod) {
    case "POST":
      let validation = await paymentValidation(body);
      if (!validation.isValid) {
        return res
          .status(400)
          .json({ success: false, message: validation.message });
      }
      try {
        //   serialize the date
        var parts = body.expirationDate.split("-");
        let expiration = new Date(parts[1], parts[0] - 1, 1);
        body.expirationDate = expiration;

        const newPayment = new Payment(body);
        await newPayment.save();
        return res.status(200).json({
          success: true,
          message: "Successfully add payment to the database",
        });
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid data for payment" });
      }

    case "GET":
      const query = req.query;
      const { user_id } = query;
      if (!user_id) {
        // GET ALL PAYMENT METHODS
        const allPayments = await Payment.find({});
        return res.status(200).json(allPayments);
      } else {
        //   GET ALL PAYMENTS OF A SPECIFIC USER
        try {
          const user = new ObjectId(user_id);
          const payments = await Payment.find({ user: user });
          if (!payments) {
            return res.status(400).json({
              success: false,
              message: "Payments of the user not found",
            });
          }
          return res.status(200).json(payments);
        } catch (error) {
          res.status(500).json({ success: false, message: "Server error" });
        }
      }
  }
}

// validate the information inputs for creating payment
const paymentValidation = async (data) => {
  const {
    user,
    nameOnCard,
    billingAddress,
    cardNumber,
    expirationDate,
    zipCode,
    securityCode,
  } = data;
  let userCheck = await userChecker(user);
  let nameCheck = nameChecker(nameOnCard);
  let addressCheck = addressChecker(billingAddress);
  let numberCheck = numberChecker(cardNumber);
  let expireCheck = expireChecker(expirationDate);
  let zipCheck = zipChecker(zipCode);
  let codeCheck = codeChecker(securityCode);
  let paymentFound = await Payment.findOne({ cardNumber: cardNumber });
  if (!userCheck) {
    return {
      isValid: false,
      message: "User are not found",
    };
  } else if (!nameCheck) {
    return {
      isValid: false,
      message: "Please enter a valid name on card.",
    };
  } else if (!addressCheck) {
    return {
      isValid: false,
      message: "Please enter a valid billing address.",
    };
  } else if (!numberCheck) {
    return {
      isValid: false,
      message: "Please enter a valid card number.",
    };
  } else if (paymentFound) {
    return {
      isValid: false,
      message: "Payment is already registered.",
    };
  } else if (!expireCheck) {
    return {
      isValid: false,
      message: "Please enter a valid expiration date.",
    };
  } else if (!zipCheck) {
    return {
      isValid: false,
      message: "Please enter a valid zip code.",
    };
  } else if (!codeCheck) {
    return {
      isValid: false,
      message: "enter a valid security code.",
    };
  }
  return {
    isValid: true,
    message: "The payment is valid.",
  };
};

// Check if the user exists in the database
const userChecker = async (user_id) => {
  const ObjectId = mongoose.Types.ObjectId; // Get the ObjectId class from Mongoose
  const objectId = new ObjectId(user_id);
  let userFound = await User.findOne({ _id: objectId });

  if (userFound) {
    return userFound;
  } else {
    return false;
  }
};

function nameChecker(name) {
  var pattern = /^[a-zA-Z]{2,}(\s[a-zA-Z]{2,})+$/;
  if (pattern.test(name)) {
    return true;
  } else {
    return false;
  }
}

function addressChecker(name) {
  var pattern = /^[a-zA-Z0-9\s\.,#-]+$/;
  if (pattern.test(name)) {
    return true;
  } else {
    return false;
  }
}

function numberChecker(cardNumber) {
  // Remove any non-digit characters from the card number
  let cardString = cardNumber.toString();
  var cleanCardNumber = cardString.replace(/\D/g, "");
  // Check if the card number contains only digits and has a length between 13 and 19 digits
  if (!/^\d{13,19}$/.test(cleanCardNumber)) {
    return false;
  }
  // Apply the Luhn algorithm to validate the card number
  var sum = 0;
  var double = false;
  for (var i = cleanCardNumber.length - 1; i >= 0; i--) {
    var digit = parseInt(cleanCardNumber.charAt(i));
    if (double) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

function zipChecker(zipCode) {
  const zipCodeRegex = /^\d{5}(?:-\d{4})?$/;
  return zipCodeRegex.test(zipCode);
}

function codeChecker(securityCode) {
  const securityCodeRegex = /^[0-9]{3,4}$/;
  return securityCodeRegex.test(securityCode);
}

function expireChecker(expiration_date) {
  var current_date = new Date();
  var parts = expiration_date.split("-");
  var expiration = new Date(parts[1], parts[0] - 1, 1);
  if (expiration >= current_date) {
    return true;
  } else {
    return false;
  }
}
