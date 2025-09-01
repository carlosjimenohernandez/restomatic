const fs = require("fs");
const bundlelist = require("./bundlelist.js");
const { js_beautify } = require(__dirname + "/dev/js-beautify.js");

let contents = "";

for(let index=0; index<bundlelist.length; index++) {
  const file = bundlelist[index];
  contents += `// @file[${index}] = ${file}\n\n${fs.readFileSync(file).toString()}\n\n`;
}

const beautifiedContents = js_beautify(contents, {
  indent_size: 2,
});

fs.writeFileSync(__dirname + "/restomatic.js", beautifiedContents, "utf8");

require("child_process").execSync("./test.sh", {
  cwd: __dirname,
  stdio: [process.stdin, process.stdout, process.stderr],
});