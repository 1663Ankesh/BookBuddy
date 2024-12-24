function errorForSignUp(obj) {
  const { email, phn, pincode } = obj;
  const errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.email = "Invalid email format.";
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phn)) {
    errors.phn = "Phone number must be exactly 10 digits.";
  }

  const pincodeRegex = /^\d{6}$/;
  if (!pincodeRegex.test(pincode)) {
    errors.pincode = "Pincode must be exactly 6 digits.";
  }

  return errors;
}

function errorForEmail(email) {
  const errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }
}



module.exports = { errorForSignUp, errorForEmail };
