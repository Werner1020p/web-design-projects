// this is a js file that will run our server 
// imports the express library
const express = require("express");

// initializes our app as an express server
const app = express()

//all of our files that we want to be on the front-end will go inside of public
app.use(express.static("public"));
//allows us to send and receive json data
app.use(express.urlencoded({ extended: true }));

let guestbookMessages = [];
//1st param: url, the location where we want to get data from
//2nd param: function, action to happen when this route is hit 
//app.get("/test", callback)
//function callback(request, response){}
app.get("/test", (request, response) => {
    // we only want to send back one type of response
    response.send("my server is working!");
});

app.get("/", (request, response) => {
    response.send("i now set up my/route");
});

app.get("/gb", (request, response) => {
    response.sendFile("guestbook.html", { root: "./public" });
});

app.post("/sign", (request, response) => {
    console.log(request.body);

    let guest = request.body.guest;
    let message = request.body.message;

    guestbookMessages.push({
        person: guest,
        note: message,
    })

    console.log("sign route has been hit");
    //response.send("hihihi");
    response.redirect("/gb");
});

app.get("/all-messages", (request, response) => {
    response.json({ allMessages: guestbookMessages });
});

app.listen(8000, () => {
    // when we write console.log inside of our SERVER it will show up in the terminal 
    console.log("server is running")
})