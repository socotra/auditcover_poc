const fs = require("fs");
let csvToJson = require("convert-csv-to-json");

class SocotraApiMock {
  constructor(product) {
    this.product = product;
  }
  auxData = {};

  tableLookup(configVersion, tableName, lookupKey) {
    let values = csvToJson.fieldDelimiter(",").getJsonFromCsv(`./src/config/products/${this.product}/policy/tables/${tableName}.csv`);
    const lookupValue = values.filter((v) => v.key === lookupKey);
    if (lookupValue && lookupValue.length > 0) {
      return lookupValue[0].value;
    }
  }

  setAuxData(locator, key, value, uiType) {
    if (!this.auxData[locator]) this.auxData[locator] = {};
    this.auxData[locator][key] = value
  }

  getAuxData(locator, key) {
    return this.auxData[locator][key] 
  }

}

exports.SocotraApiMock = SocotraApiMock;
