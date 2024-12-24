const bcrypt = require("bcrypt");

async function generatehashedpwd(pwd) {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(pwd, salt);
  return hash;
}

module.exports = generatehashedpwd;
