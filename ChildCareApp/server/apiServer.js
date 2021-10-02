const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
app.use(express.json())    // <==== parse request body as JSON ( Inbuilt to Express )
app.use(cors());
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://session8:session8@cluster0.d2dfj.mongodb.net/session8?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Global for general use
let currCollection;

client.connect(err => {
   currCollection = client.db("session8").collection("liveCode");
  // perform actions on the collection object
  console.log ('Database up!')
 
});


app.get('/', (req, res) => {
  res.send('Hello World!')
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
  console.log(`Example app listening at http://localhost:${port}`)
})