print(db)
// db.products.remove({});

// // const productsDB = [
// //     {
// //       id: 1, 
// //       Name: "Clothes",
// //       Price: 20,
// //       Category: "Shirts",
// //       Image: "",
// //     },
// //   ];

// // db.products.insertMany(productsDB);
// const count = db.products.count();
// // print('Inserted', count, 'products');

// db.counters.remove({ _id: 'products' });
// db.counters.insert({ _id: 'products', current: count });

// db.products.createIndex({ id: 1 }, { unique: true });
// db.products.createIndex({ Name: 1 });
// db.products.createIndex({ Price: 1 });
// db.products.createIndex({ Category: 1 });
// db.products.createIndex({ Image: 1 });