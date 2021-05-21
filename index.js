const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((e) =>
    console.log(
      `Connected successfully to MongoDB database ${e.connections[0].name}`
    )
  )
  .catch((err) => console.error(err));

const Todo = mongoose.model("Todo", { title: String, status: String });

// GET ALL
app.get("/", async (req, res) => {
  const todos = await Todo.find({});
  return res.send(todos);
});

// GET ONE
app.get("/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  return res.send(todo);
});

// CREATE
app.post("/", async (req, res) => {
  let todo = new Todo({
    title: req.body.title,
    status: req.body.status,
  });
  todo = await todo.save();
  return res.status(201).send(todo);
});

// UPDATE
app.put("/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, { status: req.body.status });
  return res.send(todo);
});

// DELETE
app.delete("/:id", async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  return res.send(`Deleted task ${todo._id}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
