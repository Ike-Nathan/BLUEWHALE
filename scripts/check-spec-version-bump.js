const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const specPath = path.join(rootDir, "spec", "vectors.json");

function getBaseRef() {
  const candidates = [
    process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : null,
    "origin/main",
    "main",
    "HEAD~1",
  ].filter(Boolean);

  for (const ref of candidates) {
    try {
      execSync(`git rev-parse --verify ${ref}`, { stdio: "ignore" });
      return ref;
    } catch {}
  }
  return null;
}

const baseRef = getBaseRef();
if (!baseRef) {
  console.log("No valid base git ref found to compare spec/vectors.json. Skipping version bump check.");
  process.exit(0);
}

let diffOutput = "";
try {
  diffOutput = execSync(`git diff ${baseRef}...HEAD --name-only spec/vectors.json`, { encoding: "utf8" }).trim();
} catch (e) {
  try {
    diffOutput = execSync(`git diff ${baseRef} --name-only spec/vectors.json`, { encoding: "utf8" }).trim();
  } catch {}
}

if (!diffOutput.includes("spec/vectors.json")) {
  console.log("spec/vectors.json was not modified. No spec_version bump required.");
  process.exit(0);
}

const currentSpec = JSON.parse(fs.readFileSync(specPath, "utf8"));
const currentVersion = currentSpec.spec_version;

let baseVersion = null;
try {
  const baseContent = execSync(`git show ${baseRef}:spec/vectors.json`, { encoding: "utf8" });
  baseVersion = JSON.parse(baseContent).spec_version;
} catch (e) {
  console.log("Could not read base spec/vectors.json. Assuming new or uncompared.");
  process.exit(0);
}

if (currentVersion === baseVersion) {
  console.error(
    `Error: spec/vectors.json was modified but spec_version was not incremented! Current version is still ${currentVersion}.`
  );
  process.exit(1);
}

const specPkgPath = path.join(rootDir, "packages", "spec", "package.json");
if (fs.existsSync(specPkgPath)) {
  const specPkg = JSON.parse(fs.readFileSync(specPkgPath, "utf8"));
  if (specPkg.version !== currentVersion) {
    console.error(
      `Error: packages/spec/package.json version (${specPkg.version}) does not match spec/vectors.json version (${currentVersion}).`
    );
    process.exit(1);
  }
}

console.log(`spec_version successfully bumped from ${baseVersion} to ${currentVersion}.`);
