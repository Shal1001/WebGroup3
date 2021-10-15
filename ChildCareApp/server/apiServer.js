const express = require('express');
const fs = require("fs");
const cors = require('cors');
const jimp = require("jimp"); // This helps to save the images in a small file size
const app = express();
const port = 3000;

//increase data trafer limites 
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));;
// Make avilabale the images publically 
app.use('/images', express.static(__dirname + "/images"));

app.use(cors());

const baseURL = '192.168.0.100';

const folderName = './images'

try {
	if (!fs.existsSync(folderName)) {
		fs.mkdirSync(folderName);
	}
} catch (err) {
	console.error(err);
}

const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://admin:BvJSJXzrrkzcnAwX@childcarecluster.mj85c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Global for general use
let currCollection;
let collectionChildren;


async function retriveChildren(eduFilter) {
	try {
		// create an instance of MongoClient
		const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
		await client.connect(); // client.connect() returens a promise so await hold the operations from further exicuting
		const childCollectionCurser = await client
			.db("ChildCareDatabase")
			.collection("Child")
			.find({
				"Educator.Username": { $eq: eduFilter }
			})
			.toArray();
		collectionChildren = childCollectionCurser;
		console.log(`The children of the a ${eduFilter} retrived successfully`);
		client.close();
	} catch (e) {
		console.error("Error detected:" + e);
	}
}

var childObj;
async function retriveChildrenId(childFilter) {
	console.log(childFilter);
	try {
		// create an instance of MongoClient
		const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
		await client.connect(); // client.connect() returens a promise so await hold the operations from further exicuting
		const childCollectionCurser = await client
			.db("ChildCareDatabase")
			.collection("Child")
			.find({
				"_id": ObjectId(childFilter)
			}).toArray();
		childObj = childCollectionCurser;
		console.log(`Retrive child details of Id: ${childFilter}`);
		client.close();
	} catch (e) {
		console.error("Error detected:" + e);
	}
}


app.get('/children/:educator', cors(), (req, res) => {
	var eduFilter = req.params.educator
	retriveChildren(eduFilter);
	res.send(collectionChildren)
});

app.get('/children/id/:id', cors(), (req, res) => {
	var childIdFilter = req.params.id;
	//console.log(childIdFilter);
	var childdetails = retriveChildrenId(childIdFilter);
	console.log("Retrive the child details successful");
	res.send(childObj)
})


app.post("/img", cors(), (req, res) => {

	// Base64 string
	const data = req.body.fileContent;
	const fileName = `./images/${new Date().getTime()+req.body.fileName}`;
	const fileNameAbs = `images/${new Date().getTime()+req.body.fileName}`;
	// Convert base64 to buffer 
	const buffer = Buffer.from(data, "base64");
	const imageFile = jimp.read(buffer, (err, res) => {
		if (err) throw new Error(err);
		res.quality(80).write(fileName);
	  });
	
	var imgULI = `http://${baseURL}:3000/${fileNameAbs}`;
	console.log("File Uploaded " + imgULI);
	res.json({"imageurl": imgULI});
})



app.listen(port, baseURL, () => {
	console.log(`Childcare app listening at http://localhost:${port}`)
})