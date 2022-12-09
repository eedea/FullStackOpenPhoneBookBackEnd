require("dotenv").config();
const Person = require("./models/person");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const morgan = require("morgan");
app.use(express.json());

morgan.token("body", function (req, res) {
  if (req.method === "POST") return JSON.stringify(req.body);
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

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  if (person) res.json(person);
  else res.status(404).end();
});

app.delete("/api/persons/:id", async (req, res) => {
  await Person.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

app.post("/api/persons", async (req, res) => {
  const { name, number } = req.body;
  if (!name) return res.status(400).json({ error: "Name missing" });
  if (!number) return res.status(400).json({ error: "Number missing" });
  // if (persons.find((p) => p.name === tempPerson.name))
  //   res.status(400).json({ error: "Name must be unique" });
  const newPerson = new Person({
    name,
    number,
  });
  await newPerson.save();
  res.json(newPerson);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
