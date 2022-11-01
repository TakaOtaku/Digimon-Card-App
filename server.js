const fs = require("fs");
const path = require("path");

const dir = "src/environments";
const file = "environment.ts";
const prodFile = "environment.prod.ts";

const content = `${process.env.ANGULAR_ENVIRONMENT_SECRET}`;

fs.access(dir, fs.constants.F_OK, (err) => {
  if (err) {
    //Directory doesn't exist
    console.log("src doesn't exits, creating now", process.cwd());
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }

  // Now write to file
  try {
    fs.writeFileSync(dir + "/" + file, content);
    fs.writeFileSync(dir + "/" + prodFile, content);

    console.log("Created successfully in", process.cwd());

    if (fs.existsSync(dir + "/" + file)) {
      console.log("File is created", path.resolve(dir + "/" + file));
      const str = fs.readFileSync(dir + "/" + file).toString();
      console.log(str);
    }
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
});
