import { connectDB } from "../../../../server/mongodb";
import { Payment } from "../../../../server/mongodb/models";

export default async function handler(req, res) {
  if (req.method != "POST") {
    return res
      .status(400)
      .send({ success: false, message: "Only POST requests allowed" });
  }
  const body = req.body;
  await connectDB();

  let validation = await inputValidation(body);

  // if input is ok start to look it up and return it
  if (!validation.isValid) {
    return res
      .status(400)
      .json({ success: false, message: validation.message });
  }
  try {
    var parts = body.expirationDate.split("-");
    let expiration = new Date(parts[1], parts[0] - 1, 1);
    body.expirationDate = expiration;

    const lookup = await Payment.findOne({
      nameOnCard: body.nameOnCard,
      billingAddress: body.billingAddress,
      cardNumber: body.cardNumber,
      expirationDate: body.expirationDate,
      securityCode: body.securityCode,
      zipCode: body.zipCode,
    });
    if (!lookup) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid payment",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Payment found in the database" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// validate the information inputs for creating payment

const inputValidation = async (data) => {
  const {
    nameOnCard,
    billingAddress,
    cardNumber,
    expirationDate,
    securityCode,
    zipCode,
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
function zipChecker(zipCode) {
  const zipCodeRegex = /^\d{5}(?:-\d{4})?$/;
  return zipCodeRegex.test(zipCode);
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
