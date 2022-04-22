var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//Twilio Variables
const accountSid = "";
const authToken = "";
const twilio = require("twilio");
const client = new twilio(accountSid, authToken);

// step 1: npm i nodemailer and require (and nodemon if not already installed)
var nodemailer = require("nodemailer");

var indexController = require("./controllers/index");
var usersController = require("./controllers/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexController);
app.use("/users", usersController);

// step 2: the send function
app.post("/send", (req, res) => {
  //When the send function runs, make an http post request to Twilio
  client.messages
    .create({
      body: "This will be the body of the new message!",
      from: "",
      to: "",
    })
    .then((message) => console.log(message.sid));

  // log the body of the request, to see the json data that has been parsed
  console.log(req.body);
  // html output of the message
  const output = `
  <h5>You have a new email from:</h5>
  <h3>Contact information</h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Address: ${req.body.address}</li>
    <li>Subject: ${req.body.subject}</li>
  </ul>
  <h3>Message Content</h3>
  <p>${req.body.message}</p>
  `;
  // configure the transporter properties
  let transporter = nodemailer.createTransport({
    service: "Outlook",
    port: 587,
    secure: false,
    auth: {
      user: "no1meanstackfan2022@outlook.com",
      pass: "Nodemailer1",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // options for the message
  let mailOptions = {
    from: '"Contact form user" <no1meanstackfan2022@outlook.com',
    to: "no1meanstackfan2022@outlook.com",
    subject: "Contact Request",
    text: "Hello world!",
    html: output,
  };

  // outputs whether the message was sent or sends an error
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("sent");
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
