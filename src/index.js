const express = require("express");
const mongoose = require("mongoose");
require("./db/mongoose");

//models export
const User = require("./db/models/user");
const Task = require("./db/models/task");

//routers
const usersRouter = require("./routers/usersRouter");
const tasksRouter = require("./routers/tasksRouter");

const app = express();

const port = process.env.PORT;

//expres.json() will parse automatically json data to
//an object so that it can be accessed in the body property of the request
// app.use((req, res, next) => {
//     res.status(503).send("We're under maintenance, please try again later.");
// });

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);

app.listen(port, (err, res) => {
    if (err) throw err;
    console.log(`App start on port ${port}`);
});

//import jsonwebtoken
//create generateAuthToken

// const main = async () => {
//     const user = await User.findById("5e96437fdfd89a3d52523e99");
//     await user.populate("tasks").execPopulate();
//     console.log(user.tasks);
// };

// main();

// const bcrypt = require("bcrypt");

// const match = async () => {
//     const isMatch = await bcrypt.compare(
//         "thebreakernewwavesDEAD?",
//         "$2b$08$ZKRdiJYqR1gCI/ek8zK5i.V4GQAbQPJ2WTRnlbmcxrVimt6rVsrCq"
//     );
//     console.log(isMatch);
// };

// match();

// const hasher = async () => {
//     const pass = await bcrypt.hash("thebreakernewwavesDEAD?", 8);
//     console.log(pass);
// };

// hasher();
