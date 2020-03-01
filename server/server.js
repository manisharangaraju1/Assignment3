const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');



const productsDB = [
{
    id : 1,
    Category: "Shirts",
    Name: "Indian Terrain",
    Price: 20,
    Image: "url1"
},
{
    id : 2,
    Category: "Jeans",
    Name: "Westside",
    Price: 90,
    Image: "url2"
},
{
    id : 3,
    Category: "Accessories",
    Name: "Lifestyle",
    Price: 200,
    Image: "url3"
}
]


const resolvers = {
    Query: {
        productList: productList,
    },
    Mutation: {
        productAdd,
    },
};

function productList() {
    return productsDB;
}

function productAdd(_, {product}) {
    product.id = productsDB.length+1;
    productsDB.push(product);
    return product;
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
   });

const app = express();

app.use(express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, function () {
console.log('App started on port 3000');
});