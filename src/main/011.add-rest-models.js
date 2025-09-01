// Add rest models
Add_rest_models: {

  Restomatic.utils.assertAs("Parameter «models» must be a string").that(typeof Restomatic.parameters.models === "string");
  let foundModels = false;
  try {
    const modelsPath = require("path").resolve(process.cwd(), Restomatic.parameters.models);
    foundModels = require(modelsPath);
  } catch (error) {
    foundModels = error;
    console.log(error);
  }
  Restomatic.utils.assertAs("Parameter «models» must point to an existing and readable file").that(!(foundModels instanceof Error));
  Restomatic.utils.assertAs("File of parameter «models» must return an object").that(typeof foundModels === 'object');
  Restomatic.parameters.schema = {};
  for(let modelId in foundModels) {
    const modelMetadata = foundModels[modelId];
    Restomatic.utils.assertAs(`Model «${modelId}» must be an object`).that(typeof modelMetadata === 'object');
    Restomatic.parameters.schema[modelId] = modelMetadata;
    try {
      const createTableSql = Restomatic.utils.buildSqlCreateTable(modelId, modelMetadata);
      const result = Restomatic.utils.executeSql(createTableSql);
    } catch (error) {
      if((error.name === "SqliteError") && (error.message.endsWith("already exists"))) {
        console.log(`[*] Table «${modelId}» already exists in the database`);
      } else {
        throw error;
      }
    }
    
  }

}