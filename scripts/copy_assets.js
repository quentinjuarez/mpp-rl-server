const fs = require("fs");
const path = require("path");

// Copy all assets files to dist folder, create dist/assets folder if not exists
const sourcePath = path.join(__dirname, "../src/assets/favicon.ico");
const targetPath = path.join(__dirname, "../dist/assets/favicon.ico");

console.log(sourcePath, targetPath);

fs.copyFile(sourcePath, targetPath, (err) => {
  if (err) throw err;
  console.log("/assets copied successfully!");
});
