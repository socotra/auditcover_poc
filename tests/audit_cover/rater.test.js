const fs = require("fs");
const { getPerilRates } = require("../../src/scripts/audit_cover/rater");
const { SocotraApiMock } = require("../mock/socotra-api");

global.socotraApi = new SocotraApiMock("Commercial Property");

test("Rater function", () => {
  let input = JSON.parse(fs.readFileSync("./tests/audit_cover/data/rater-data.json"));
  let expectedOutput = JSON.parse(fs.readFileSync("./tests/audit_cover/data/rater-resp.json"));
  expect(getPerilRates(input)).toStrictEqual(expectedOutput);
});
