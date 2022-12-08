const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}
const password = process.argv[2];
const mongodbURL = `mongodb+srv://fsoPhonebook:${password}@cluster0.73frpc1.mongodb.net/phonebook?retryWrites=true&w=majority
`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  mongoose
    .set("strictQuery", true)
    .connect(mongodbURL)
    .then((result) => {
      return Person.find();
    })
    .then((people) => {
      console.log("Phonebook:");
      people.forEach(({ name, number }) => {
        console.log(`${name} ${number}`);
      });
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
} else {
  mongoose
    .set("strictQuery", true)
    .connect(mongodbURL)
    .then((result) => {
      const name = process.argv[3];
      const number = process.argv[4];
      const person = new Person({ name, number });
      return person.save();
    })
    .then(({ name, number }) => {
      console.log(`Added ${name} number ${number} to phonebook`);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
