const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
app.use(express.json())    
app.use(cors());


// the following also used to rectify some security error I had during the development.
/*Referance
 *https://stackoverflow.com/questions/32500073/request-header-field-access-control-allow-headers-is-not-allowed-by-itself-in-pr
 */
 app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", `http://192.168.0.100:3000`);
    res.setHeader("Access-Control-Allow-Origin", `http://192.168.0.100:8001`);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });


const {MongoClient, ObjectId} = require('mongodb');
//let ObjectId = MongoClient.ObjectId;

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
			"Educator.Username": {$eq: eduFilter}
		})
		.toArray();
		collectionChildren = childCollectionCurser;
		console.log(childCollectionCurser);
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
		console.log(childCollectionCurser);
		client.close();
	} catch (e) {
	  console.error("Error detected:" + e);
	}
  }


app.get('/children/:educator', (req, res) => {
	var eduFilter = req.params.educator
	retriveChildren(eduFilter);
	res.send(collectionChildren)
});

app.get('/children/id/:id', (req, res) => {
	var childIdFilter = req.params.id;
	//console.log(childIdFilter);
	var childdetails = retriveChildrenId(childIdFilter);
	console.log(childdetails);
	res.send(childObj)
})


app.listen(port, '192.168.0.100', () => {
  console.log(`Childcare app listening at http://localhost:${port}`)
})