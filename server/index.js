const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const https = require("https");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const fs = require("fs");
const usersRoutes = require("./Routes/users");
const commentsRoutes = require("./Routes/comments");
const donationsRoutes = require("./Routes/donations")
const projectRoutes = require("./Routes/project");
const mediaRoute = require("./Routes/media");
require("dotenv").config();

// const connectionString = process.env.MONGO_CONNECTION_STRING;
 const connectionString = `mongodb+srv://fundmecash:fundme123@cluster0.jobe7.mongodb.net/fundme?retryWrites=true&w=majority`
// env.MONGO_ATLAS_PW}@cluster0.jobe7.mongodb.net/fundme?retryWrites=true&w=majority`;
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
  console.log(
    "open done" + mongoose.connection.host + "\t" + mongoose.connection.port
  );
  if (error) {
    console.log("error" + error);
  } else {
  }
});

/* mongoose.connect(process.env.MONGO_URI)
    .then(connection => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
      console.log(error.message)
     })

const key = fs.readFileSync(__dirname + '/cert/localhost.key');
const cert = fs.readFileSync(__dirname + '/cert/localhost.crt');
const options = {
  key: key,
  cert: cert
};

*/

app.prepare().then(() => {
  const server = express();
  // const httpsServer = https.createServer(options,server);

  server.use(bodyParser.json({ limit: "50mb" }));
  //All Requests from app come here and are fwd to routes
  server.use("/api/users", usersRoutes);
  server.use("/api/comments", commentsRoutes);
  server.use("/api/donations", donationsRoutes);
  server.use("/api/project", projectRoutes);
  server.use("/api/media", mediaRoute);
  //All requests that are unhandled i.e React requests.
  server.get("*", (req, res) => {
    return handle(req, res);
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log("> Read on http://localhost:3000");
  });
});
