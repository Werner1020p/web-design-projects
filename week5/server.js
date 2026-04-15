//1. Import Libraries 
//imports the express library
const express = require("express");
//imports our database library
let nedb = require("@seald-io/nedb");

let nunjucks = require("nunjucks")

//2. INITIALIZE LIBRARY SETTINGS
let app = express();
// set up our database variable that we are storing data in an external life
let database = new nedb({ filename: "data.db", autoload: true });

//setting up my nunjucks template 
nunjucks.configure("views", {
    autoescape: true,
    express: app,
});

//express will use the template engine of nunjucks 
app.set("view engine", "njk");

//3. MIDDLEWARE: SETTINGS FOR OUR APPLICATION
app.use(express.static("assets"));
app.use(express.urlencoded({ extended: true }));

//4. ROUTES
app.get("/", (request, response) => {
    // any database manipulation needs to happen before sending the response 
    database.insert({ data: "hello" });
    // inside of a request, this always needs to go at the end
    response.send("<h1>hi</h1>");
});

app.get("/data", (request, response) => {
    let query = {};

    database.find(query, (error, foundData) => {
        if (error) {
            // if error found, send error response 
            response.send("error");
        } else {
            //send back the found data in json format 
            // format my found data in json
            let formattedJSON = {
                allData: foundData,
            };
            response.json(formattedJSON);
        }
    });
});

app.get("/guestbook", (request, response) => {
    //use the render function to convert any special .njk data into our client html
    //the second parameter is an object that represents the data that is going to be populated on the client-side

    response.render("guestbook.njk", { serverData: "<h1>hello</h1>" });
});

app.post("/sign", (request, response) => {
    console.log(request.body);
    let guestSignature = {
        guestName: request.body.guest,
        guestMessage: request.body.guestMessage,
    };

    // storing the data in the database
    database.insert(guestSignature);

    // send the user back to the guestbook
    response.redirect("/guestbook");
});

app.get("/display-guest-message", (request, response) => {
    let query = {
        guestName: { $exists: true }
    }
    database.find(query, (error, foundData) => {
        if (error) {
            response.redirect("/guestbook");
        } else {
            //response.json(foundData)
            console.log(foundData);
            response.render("messages.njk", { messages: foundData });
        }
    });
});

//LAST: START OUR SERVER
app.listen(9001, () => {
    console.log("server is now running");
}); 