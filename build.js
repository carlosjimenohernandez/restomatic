const fs = require("fs");
const bundlelist = require("./bundlelist.js");

let contents = "";

for(let index=0; index<bundlelist.length; index++) {
  const file = bundlelist[index];
  contents += `// @file[${index}] = ${file}\n\n${fs.readFileSync(file).toString()}\n\n`;
}

fs.writeFileSync(__dirname + "/restomatic.js", contents, "utf8");

require("child_process").execSync("./test.sh", {
  cwd: __dirname,
  stdio: [process.stdin, process.stdout, process.stderr],
});