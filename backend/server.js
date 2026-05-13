const express = require("express");
const router = require("./routes");
const dotenv = require("dotenv");
const dns = require("dns");
const dbConfig = require("./configs/dbConfig");
const app = express();
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();
dbConfig();
app.use(express.json());
app.use(router);

app.listen(8000, () => {
  console.log("server running");
});
