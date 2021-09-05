require('dotenv').config();
const aesjs = require('aes-js');
const pbkdf2 = require('pbkdf2');

const decryptApplication = (data) => {
  const encryptedNameHex = data.Application.name;
  const encryptedProblemHex = data.Application.problem;
  
  // Create key in 128-bit(16 bytes). AES requires exact key length in 3 possible length.
  const aesKey = pbkdf2.pbkdf2Sync(process.env.PBKDF2_PASSWORD, process.env.PBKDF2_SALT, 1, 128/8, 'sha512');
  // Convert Hex to bytes
  const encryptedNameBytes = aesjs.utils.hex.toBytes(encryptedNameHex);
  const encryptedProblemBytes = aesjs.utils.hex.toBytes(encryptedProblemHex);
  // Decrypt bytes
  const aesCtr = new aesjs.ModeOfOperation.ctr(aesKey);
  const decryptedNameBytes = aesCtr.decrypt(encryptedNameBytes);
  const decryptedProblemBytes = aesCtr.decrypt(encryptedProblemBytes);
  // Convert bytes back into text
  const decryptedName = aesjs.utils.utf8.fromBytes(decryptedNameBytes);
  const decryptedProblem = aesjs.utils.utf8.fromBytes(decryptedProblemBytes);

  data.Application.name = decryptedName;
  data.Application.problem = decryptedProblem;

  return data;
}

module.exports = decryptApplication;