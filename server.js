const express = require("express");
// const mysql = require('mysql')
const { ObjectId } = require("mongodb");
const { connectToDB, getDb } = require("./db");

// const cors = require('cors')
const app = express();
app.use(express.json());

//dbconnection
connectToDB((error) => {
  if (!error) {
    app.listen(5000, () => {
      console.log("Listening on port 5000");
    });
    db = getDb();
  }
});

//routes
app.get("/books", (req, res) => {
//current page
const page = req.query.p || 0

//number of items per page
const booksPerPage = 3



  let books = [];

  db.collection("books")
    .find()
    .sort({ author: 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ message: "Could not fetch the documents" });
    });
});

//GET REQUEST
app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((error) => {
        res.status(500).json({ error: "Could not fetch the document" });
      });
  } else {
    res.status(500).json({ error: "Not valid document ID" });
  }
});

//POST REQUEST
app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json({ result });
    })
    .catch(() => {
      res.status(500).json({ error: "Could not create a new document" });
    });
});

///DELETE REQUEST
app.delete("/books/:id", (req,res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: "Could not fetch the document" });
      });
  } else {
    res.status(500).json({ error: "Not valid document ID" });
  }
})

//UDPATE REQUEST
app.patch("/books/:id", (req,res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(req.params.id)}, {$set: updates})
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: "Could not fetch the document" });
      });
  } else {
    res.status(500).json({ error: "Not valid document ID" });
  }
})