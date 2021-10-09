const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
app.use(express.json())    
app.use(cors());

const baseURL = '192.168.0.100';


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


app.get('/children/:educator', cors(), (req, res) => {
	var eduFilter = req.params.educator
	retriveChildren(eduFilter);
	res.send(collectionChildren)
});

app.get('/children/id/:id', cors(), (req, res) => {
	var childIdFilter = req.params.id;
	//console.log(childIdFilter);
	var childdetails = retriveChildrenId(childIdFilter);
	console.log(childdetails);
	res.send(childObj)
})


app.listen(port, baseURL , () => {
  console.log(`Childcare app listening at http://localhost:${port}`)
})