Restomatic.utils.buildSqlSelect = function(parameters) {
  const { from, where, order, page, items } = parameters;
  let sql = "";
  sql += `SELECT * FROM ${from}`;
  Apply_where:
  if(where) {
    sql += Restomatic.utils.buildSqlWhere(where, from);
  }
  Apply_order:
  if(order) {
    let orderSanitized = order;
    if(typeof order === 'string') {
      orderSanitized = JSON.parse(order);
    }
    Restomatic.utils.assertAs("Parameter «order» must be an array").that(Array.isArray(orderSanitized));
    if(orderSanitized.length === 0) {
      break Apply_order;
    }
    sql += `\n  ORDER BY `;
    for(let index=0; index<orderSanitized.length; index++) {
      let orderRule = orderSanitized[index];
      if(index !== 0) {
        sql += ", ";
      }
      if(orderRule.startsWith("!")) {
        sql += orderRule.substr(1) + " DESC";
      } else {
        sql += orderRule + " ASC";
      }
    }
  }
  Apply_pagination:
  if(page || items) {
    const itemsNumber = parseInt(items);
    const pageNumber = parseInt(page);
    const limit = itemsNumber;
    const offset = (itemsNumber * pageNumber) - itemsNumber;
    sql += `\n  LIMIT ${limit}`;
    sql += `\n  OFFSET ${offset}`;
  }
  sql += ";";
  return sql;
};