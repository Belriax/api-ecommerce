// pacotes
const express = require("express");
const compression = require("compression");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

// start
const app = express();

// variáveis de ambiente
const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;

// arquivos estaticos
app.use("/public", express.static(__dirname + "/public"));
app.use("/public/images", express.static(__dirname + "/images"));

// setup mongoDB
const dbs = require("./config/database");
const dbURI = isProduction ? dbs.dbProduction : dbs.dbTest;
mongoose.connect(dbURI, { useNewUrlParser: true });

// setup EJS
app.set("view engine", "ejs");

// configurações
if(!isProduction) app.use(morgan("dev"));
app.use(cors());
app.disable('x-powered-by');
app.use(compression());

// setup body parser
app.use(bodyParser.urlencoded({ extended: false, limit: 1.5*1024*1024 }));
app.use(bodyParser.json({ limit: 1.5*1024*1024 }));

// models
require("./models");

// rotas
app.use("/", require("./routes/"));

// 404 - rota
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// rota - 422, 500 ,401
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  if(err.status !== 404) console.warn("Error: ", err.message, new Date());
  res.json(err);
});

// escuta
app.listen(PORT, (err) =>{
  if(err) throw err;
  console.log(`Rodando na //localhost:${PORT}`);
})