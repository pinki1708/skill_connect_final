const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("PROBE OK");
});

app.listen(8080, () => {
  console.log("PROBE LISTENING ON 8080");
});
