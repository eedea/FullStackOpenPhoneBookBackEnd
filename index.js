require("dotenv").config();
const Person = require("./models/person");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const morgan = require("morgan");
app.use(express.json());

morgan.token("body", function (req, res) {
  // if (req.method === "POST")
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(express.static("build"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.static("build"));

app.get("/info", async (req, res) => {
  const people = await Person.find();
  res.send(`<p>Phonebook has info for ${people.length} people.</p>
            <p>${Date()}</p>`);
});

app.get("/api/persons", async (req, res) => {
  const people = await Person.find();
  res.json(people);
});

app.get("/api/persons/:id", async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
});

app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.post("/api/persons", async (req, res, next) => {
  const { name, number } = req.body;
  const person = await Person.findOne({ name });
  if (person) return res.status(400).json({ error: "Name must be unique" });
  const newPerson = new Person({
    name,
    number,
  });
  try {
    await newPerson.save();
    res.json(newPerson);
  } catch (err) {
    next(err);
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  const { number } = req.body;
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { number },
      { new: true, runValidators: true, context: "query" }
    );
    if (updatedPerson) {
      res.json(updatedPerson);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
});

const errorHandeler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

app.use(errorHandeler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
