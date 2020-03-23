const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');
require('dotenv').config();


const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';

const url = process.env.DB_URL || 'mongodb+srv://manisha:manisha@cluster0-bxsg8.mongodb.net/test';
const port = process.env.API_SERVER_PORT || 3000;
let db;

async function connectToDatabase() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to Database');
  db = client.db();
}


async function productList() {
  const products = await db.collection('products').find({}).toArray();
  return products;
}

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function productAdd(_, { product }) {
  const newProduct = { product };
  newProduct.id = await getNextSequence('products');
  const result = await db.collection('products').insertOne(newProduct);
  const savedProduct = await db.collection('products').findOne({ _id: result.insertedId });
  return savedProduct;
}


const resolvers = {
  Query: {
    productList,
  },
  Mutation: {
    productAdd,
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();

server.applyMiddleware({ app, path: '/graphql', cors: enableCors });

(async function start() {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log('API server started on port', port);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());
