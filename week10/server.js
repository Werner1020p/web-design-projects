// how do we know this is a npm project?
// A: because it has a package.json file

// what command do we run to start an npm project?
// A: npm init

// how do we create the node_modules folder if it doesn't exist?
// A: run npm install

// what does the below chunk of code do?
// A: it imports the libraries/packages we need for the project
const express = require('express');
const multer = require('multer');
const nunjucks = require('nunjucks');
const nedb = require('@seald-io/nedb');

// what is app?
// A: app is our Express application/server
const app = express();

// what is database?
// A: database is our neDB database, and it stores data in data.db
const database = new nedb({ filename: 'data.db', autoload: true });

// what is this configuring?
// A: this configures multer so uploaded files are saved in public/uploads
const upload = multer({
	dest: 'public/uploads',
});

// what do each of these statements do?
// write the answer next to the line of code
app.use(express.static('public')); // A: makes files in the public folder available on the front end
app.use(express.urlencoded({ extended: true })); // A: lets the server read form data from req.body
app.set('view engine', 'njk'); // A: tells Express that Nunjucks .njk files will be used as templates
nunjucks.configure('views', {
	autoescape: true,
	express: app,
}); // A: connects Nunjucks to Express and tells it to look in the views folder for templates

// what type of request is this? what does it do?
// A: this is a GET request, and it sends back data/page when the user visits "/"
app.get('/', (request, response) => {
	// how many different responses can we write? list them.
	// A: one response per request. Examples: response.send(), response.json(), response.render(), response.redirect(), response.sendFile()

	// how many parameters does response.render use? list them.
	// A: usually 2 parameters: 1) the template file name 2) the data/object we want to send into the template

	// write out the render for index.njk using the database
	// A:
	database.find({}, (error, foundData) => {
		response.render('index.njk', { data: foundData });
	});
});

// what are the three parameters in this function?
// A: 1) the route '/upload' 2) upload.single('theimage') middleware 3) the callback function (req, res) => {}
app.post('/upload', upload.single('theimage'), (req, res) => {
	let currentDate = new Date();

	// what type of data structure is this?
	// A: object
	let data = {
		dataCaption: req.body.text,
		date: currentDate.toLocaleString(),
		timestamp: currentDate.getTime(),
	};

	// why do we write this if statement?
	// A: to check if the user actually uploaded a file before trying to save the image path
	if (req.file) {
		data.image = '/uploads/' + req.file.filename;
	}

	// what does the insert function do?
	// A: it adds/saves new data into the database
	database.insert(data);

	res.redirect('/');
});

// what does the number signify?
// A: it is the port number the server runs on

// how do we access this on the web?
// A: by going to http://localhost:6001
app.listen(6001, () => {
	console.log('server started on port 6001');
});

// continue answering the questions in the index.njk