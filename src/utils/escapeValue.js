Restomatic.utils.escapeValue = function(text) {
  return require("sqlstring").escape(text);
};