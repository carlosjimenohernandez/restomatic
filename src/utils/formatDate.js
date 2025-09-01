Restomatic.utils.formatDate = function(date) {
  let formatted = "";
  formatted += ("" + date.getFullYear()).padStart(4, "0");
  formatted += "." + ("" + (date.getMonth()+1)).padStart(2, "0");
  formatted += "." + ("" + date.getDate()).padStart(2, "0");
  formatted += "." + ("" + date.getHours()).padStart(2, "0");
  formatted += "." + ("" + date.getMinutes()).padStart(2, "0");
  formatted += "." + ("" + date.getSeconds()).padStart(2, "0");
  formatted += "." + ("" + date.getMilliseconds()).padStart(3, "0");
  return formatted;
};