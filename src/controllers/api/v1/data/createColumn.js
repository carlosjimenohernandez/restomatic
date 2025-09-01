Restomatic.controllers.api.v1.data.createColumn = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("createColumn", request.headers.token || request.body?.token || request.query.token || false);
    const table = request.body?.table || request.query.table || false;
    const column = request.body?.column || request.query.column || false;
    const content = request.body?.content || request.query.content || false;
    const sanitizedCreateColumn = Restomatic.utils.buildSqlCreateColumn(table, column, content);
    const output = Restomatic.utils.executeSql(sanitizedCreateColumn);
    return response.success({
      operation: "api/v1/data/createColumn",
      output,
    });
  } catch (error) {
    return response.fail(error);
  }
};