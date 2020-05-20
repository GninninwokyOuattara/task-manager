const express = require("express");
require("./db/mongoose");

//routers

const usersRouter = require("./routers/usersRouter");
const tasksRouter = require("./routers/tasksRouter");

const app = express();

//expres.json() will parse automatically json data to
//an object so that it can be accessed in the body property of the request
// app.use((req, res, next) => {
//     res.status(503).send("We're under maintenance, please try again later.");
// });

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);

module.exports = app;
