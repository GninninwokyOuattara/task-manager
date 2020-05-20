const app = require("./app");

const port = process.env.PORT;

//expres.json() will parse automatically json data to
//an object so that it can be accessed in the body property of the request
// app.use((req, res, next) => {
//     res.status(503).send("We're under maintenance, please try again later.");
// });

app.listen(port, (err, res) => {
    if (err) throw err;
    console.log(`App start on port ${port}`);
});
