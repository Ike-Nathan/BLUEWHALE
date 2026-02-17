const { execSync } = require("child_process");

console.log("Starting coordinated release sequence...");

try {
  // 1. Validate spec
  console.log("Validating specification...");
  execSync("npm run spec:validate", { stdio: "inherit" });

  // 2. Check synchronization
  console.log("Checking package version synchronization...");
  execSync("npm run spec:sync-check", { stdio: "inherit" });

  // 3. Run all tests
  console.log("Running cross-language test suites...");
  execSync("pnpm -r test", { stdio: "inherit" });

  // 4. Changeset versioning (if in a real changeset flow)
  // console.log('Applying changesets...');
  // execSync('pnpm changeset version', { stdio: 'inherit' });

  console.log("Release sequence completed successfully.");
} catch (error) {
  console.error("Release sequence failed at some stage.");
  process.exit(1);
}
