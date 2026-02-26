const path = require("path");
const fs = require("fs");

// Debug info
console.log("CWD =", process.cwd());
console.log("__dirname =", __dirname);
console.log(
  "ENV EXISTS =",
  fs.existsSync(path.join(__dirname, ".env"))
);

// Load env
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

// Show env values
console.log("PORT =", process.env.PORT);
console.log("JWT_SECRET =", process.env.JWT_SECRET);

// App start
const app = require("./src/app.js");

const PORT=8080;

app.listen(PORT, () => {
  console.log(`✅ Server is running on PORT ${PORT}`);
});
