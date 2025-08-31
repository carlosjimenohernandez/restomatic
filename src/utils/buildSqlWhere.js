(function () {

  const validOperations = {
    "=": "=",
    "!=": "!=",
    "<": "<",
    "<=": "<=",
    ">": ">",
    ">=": ">=",
    "like": "like",
    "not like": "not like",
    "in": "in",
    "not in": "not in",
    "is null": "= null",
    "is not null": "!= null",
  }

  Restomatic.utils.buildSqlWhere = function (whereOriginal, table) {
    let whereInput = whereOriginal;
    if (typeof whereInput === "string") {
      whereInput = JSON.parse(whereInput);
    }
    Restomatic.utils.assertAs("Parameter «where» must be an array").that(Array.isArray(whereInput));
    let sql = "";
    for (let indexCondition = 0; indexCondition < whereInput.length; indexCondition++) {
      const whereCondition = whereInput[indexCondition];
      Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}» must be an array`).that(Array.isArray(whereCondition));
      Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}» must contain at least 2 items`).that(whereCondition.length >= 2);
      Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/1» must be a valid operation`).that(whereCondition[1] in validOperations);
      const operator = validOperations[whereCondition[1]];
      const sanitizedField = Restomatic.utils.escapeId(table) + "." + Restomatic.utils.escapeId(whereCondition[0]);
      if(indexCondition === 0) {
        sql += "\n  WHERE ";
      } else {
        sql += "\n  AND ";
      }
      if(operator === "= null") {
        sql += `${sanitizedField} IS NULL`;
      } else if(operator === "!= null") {
        sql += `${sanitizedField} IS NOT NULL`;
      } else if(operator === "like") {
        Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/2» must be a string to fit «is like» operator`).that(typeof whereCondition[2] === "string");
        const sanitizedComplement = Restomatic.utils.escapeValue(whereCondition[2]);
        sql += `${sanitizedField} LIKE ${sanitizedComplement}`;
      } else if(operator === "not like") {
        Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/2» must be a string to fit «is not like» operator`).that(typeof whereCondition[2] === "string");
        const sanitizedComplement = Restomatic.utils.escapeValue(whereCondition[2]);
        sql += `${sanitizedField} NOT LIKE ${sanitizedComplement}`;
      } else if(operator === "in") {
        Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/2» must be an array to fit «is in» operator`).that(Array.isArray(whereCondition[2]));
        const sanitizedComplement = Restomatic.utils.escapeValue(whereCondition[2]);
        sql += `${sanitizedField} IN (${sanitizedComplement})`;
      } else if(operator === "not in") {
        Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/2» must be an array to fit «is not in» operator`).that(Array.isArray(whereCondition[2]));
        const sanitizedComplement = Restomatic.utils.escapeValue(whereCondition[2]);
        sql += `${sanitizedField} NOT IN (${sanitizedComplement})`;
      } else if(["=","!=","<","<=",">",">="].indexOf(operator) !== -1) {
        Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/2» must be a string or a number to fit «${operator}» operator`).that((typeof whereCondition[2] === "string") || (typeof whereCondition[2] === "number"));
        const sanitizedComplement = Restomatic.utils.escapeValue(whereCondition[2]);
        sql += `${sanitizedField} ${operator} ${sanitizedComplement}`;
      } else {
        throw new Error(`Operator «${operator}» was not idenfitied`);
      }
    }
    return sql;
  };
})();