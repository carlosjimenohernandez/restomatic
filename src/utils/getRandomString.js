Restomatic.utils.getRandomString = function(len = 5, alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  let out = "";
  while (out.length < len) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
};