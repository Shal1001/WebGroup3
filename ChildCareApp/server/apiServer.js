const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
app.use(express.json())    // <==== parse request body as JSON ( Inbuilt to Express )
app.use(cors());

//During the develoment I had securtiy issues that caused issues in accessing endpoints
// helmet allowed me to overcome these issues
const helmet = require("helmet");
app.use(helmet());

// the following also used to rectify some security error I had during the development.
/*Referance
 *https://stackoverflow.com/questions/32500073/request-header-field-access-control-allow-headers-is-not-allowed-by-itself-in-pr
 */
 app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", `http://localhost:3000`);
    res.setHeader("Access-Control-Allow-Origin", `http://localhost:8000`);
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


const MongoClient = require('mongodb').MongoClient;
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
	} catch (e) {
	  console.error("Error detected:" + e);
	}
  }


app.get('/children/:educator', (req, res) => {
	var eduFilter = req.params.educator
	retriveChildren(eduFilter);
	res.send(collectionChildren)
})


app.post('/postData', (req, res) => {
    	console.log("Data: " + JSON.stringify(req.body));
	
	    currCollection.insertMany( req.body , function(err, result) {
	       if (err) {
				console.log(err);
			}else {
			    console.log({"msg" : result.insertedCount + " Records Inserted Count:"}); 
				res.send({"msg" : result.insertedCount + " Records Inserted:"});
		 	}// end
		
	});
	
  })
  

app.get('/getData', (req, res) => {

	currCollection.find().toArray( function(err,docs) {
		if(err) {
		  console.log("Some error.. " + err);
		} else {
		   console.log( JSON.stringify(docs) + " have been retrieved.");
		   res.send("<h4>" + JSON.stringify(docs) + " : " +  err + "</h4>");
		}

	});

});

app.listen(port, () => {
  console.log(`Childcare app listening at http://localhost:${port}`)
})