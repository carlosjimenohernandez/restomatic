Restomatic.controllers.api.v1.data.createTable = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("createTable", request.headers.token || request.body?.token || request.query.token || false);
    const table = request.body?.table || request.query.table || false;
    const content = request.body?.content || request.query.content || false;
    const sanitizedCreateTable = Restomatic.utils.buildSqlCreateTable(table, content);
    const output = Restomatic.utils.executeSql(sanitizedCreateTable);
    return response.success({
      operation: "api/v1/data/createTable",
      output,
    });
  } catch (error) {
    return response.fail(error);
  }
};