const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");


const app = express();

app.use(cors());

// prase request of content-tpye - application/json
app.use(express.json());

// parse requests of content-type application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
        name: "bezkoder-session",
        //keys: ['key1', '[key2]'],
        secret: "COOKIE_SECRET", // should use as a secret enviroment variable
        httpOnly: true
    })
);

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});


