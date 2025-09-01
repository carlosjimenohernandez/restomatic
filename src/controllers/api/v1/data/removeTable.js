Restomatic.controllers.api.v1.data.removeTable = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("removeTable", request.headers.token || request.body?.token || request.query.token || false);
    const table = request.body?.table || request.query.table || false;
    const sanitizedRemoveTable = Restomatic.utils.buildSqlRemoveTable(table);
    const output = Restomatic.utils.executeSql(sanitizedRemoveTable);
    return response.success({
      operation: "api/v1/data/removeTable",
      output,
    });
  } catch (error) {
    return response.fail(error);
  }
};