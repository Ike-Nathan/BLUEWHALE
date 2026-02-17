const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");

const schemaPath = path.join(__dirname, "schema.json");
const vectorsPath = path.join(__dirname, "vectors.json");

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const vectors = JSON.parse(fs.readFileSync(vectorsPath, "utf8"));

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
const valid = validate(vectors);

if (!valid) {
  console.error("Spec validation failed:");
  console.error(ajv.errorsText(validate.errors, { separator: "\n" }));
  process.exit(1);
}

console.log(
  "Spec validation passed (spec_version: " + vectors.spec_version + ")",
);
