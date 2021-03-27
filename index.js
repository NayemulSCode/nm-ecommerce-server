const express = require('express')
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port = 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_UPASS}@cluster0.zqmy8.mongodb.net/nmEcommerce?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//middle wear body-parser,cors;
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/',(req, res)=>{
    res.send('Nm server okay')
})




client.connect(err => {
  const productsCollection = client.db("nmEcommerce").collection("products");
  // perform actions on the collection object
  app.post('/addProduct',(req, res) =>{
    const products = req.body;
    console.log(req.body);
    productsCollection.insertMany(products)
    .then(result =>{
      res.send(result.insertedCount);
      console.log(result);
    })
  })
 
  console.log('db connected');
});


app.listen(port,()=>{
    console.log(`Server run ${port}`)
})