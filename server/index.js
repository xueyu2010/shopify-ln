// server entry point and APIs
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3001;


app.use("/", router);
app.use(express.static("../public"));

// TODO remove this after deploy to production
app.all("/*", (req, res, next) => {
  //res.header("X-XSS-Protection", 0);
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/*", (req, res, next) => {
  //res.header("X-XSS-Protection", 0);
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// mock the frontend look if you dont have a BE ready
app.get("/api/shopify/invoice", (req, res) => {
  const invoice =
    "lnbc1500n1pw2a0xzpp5ukf3zzgnwzen8pfcdnf0vap7lc4va3qhzgg5cdeq5yxxh93heynsdpa2fjkzep6ypxxjemgw3hxjmn8yptkset9dssx7e3qgehhyar4dejjqatsv3shgcqzpgxqr23sc2gafv5wngaslf8p4nhpvmqph43nnfunww47kqlk35zxwx27akcyutkrh6rwmjpz7v4cq5s3cp74skakg860tzpw236vvaswsjp2t3gpk2zz8k";
  res.json(invoice);
});


app.listen(port, () => console.log(`App listening on port ${port}!`));

// Error handling
app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Opps, Something is broken!");
});

module.exports = app;
