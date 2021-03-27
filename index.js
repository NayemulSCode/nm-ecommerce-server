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
  const ordersCollection = client.db("nmEcommerce").collection("orders");
  // create products
  app.post('/addProduct',(req, res) =>{
    const products = req.body;
    // console.log(req.body);
    productsCollection.insertMany(products)
    .then(result =>{
      res.send(result.insertedCount);
      // console.log(result);
    })
  })
  //read products
  app.get('/products',(req, res) =>{
    productsCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })
  //load single product
  app.get('/product/:key', (req, res) =>{
    productsCollection.find({key:req.params.key})
    .toArray((err, documents) =>{
      res.send(documents[0]);
    })
  })
  //load order data or card data
  app.post('/productByKey',(req, res) =>{
    const productKeys = req.body;
    productsCollection.find({key: {$in: productKeys}})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })
  // create order
  app.post('/addOrder',(req, res) =>{
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result =>{
      res.send(result.insertedCount > 0);
    })
  })
 
  console.log('db connected');
});


app.listen(port,()=>{
    console.log(`Server run ${port}`)
})