import { connectDB } from "../../../server/mongodb";
import Payment from "../../models/payment.js";

export default async function handler(req, res) {
  const reqMethod = req.method;
  const body = req.body;
  await connectDB();
  switch (reqMethod) {
    case "POST":
      //   let validation = await paymentValidation(body);
      let paymentValidation = True;
      if (!validation.isValid) {
        return res
          .status(400)
          .json({ success: false, message: validation.message });
      }
      try {
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
  }
}

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
  let nameCheck = nameChecker(nameOnCard);
  let addressCheck = addressChecker(billingAddress);
  let numberCheck = numberChecker(cardNumber);
  let expireCheck = expireChecker(expirationDate);
  let zipCheck = zipChecker(zipCode);
  let codeCheck = codeChecker(securityCode);
  if (!nameCheck) {
    return {
      isValid: false,
      message: "The email field Please enter a valid name on card.",
    };
  } else if (!addressCheck) {
    return {
      isValid: false,
      message: "The email field Please enter a valid billing address.",
    };
  } else if (!numberCheck) {
    return {
      isValid: false,
      message: "The email field Please enter a valid card number.",
    };
  } else if (!expireCheck) {
    return {
      isValid: false,
      message: "The email field Please enter a valid expiration date.",
    };
  } else if (!zipCheck) {
    return {
      isValid: false,
      message: "The email field Please enter a valid zip code.",
    };
  } else if (!codeCheck) {
    return {
      isValid: false,
      message: "The email field Please enter a valid security code.",
    };
  } else {
    return {
      isValid: true,
      message: "The payment is valid.",
    };
  }
};
//  check if user exist in the database
//  check if the user already have a card find by user
// the user can have different payment methods means card

// Pattern for validating name with at least two words
function nameChecker(name) {
  var pattern = /^[a-zA-Z]{2,}(\s[a-zA-Z]{2,})+$/;
  if (pattern.test(name)) {
    return true;
  } else {
    return false;
  }
}

// Pattern for  allows alphanumeric characters, spaces, dots, commas, hash symbols, and hyphens in the address
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
  var cleanCardNumber = cardNumber.replace(/\D/g, "");
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
// expirationdate code checker
