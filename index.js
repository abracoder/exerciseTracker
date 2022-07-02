const express = require('express')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let uri = process.env.MONGO_URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let exSchema = new mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String,
});

let userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  log: [exSchema],
  count: { type: Number },
});

let User = mongoose.model("User", userSchema);
let Exercise = mongoose.model("Exercise", exSchema);


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  const { username } = req.body;
  let user = await User.findOne({ username: req.body.username });
  if (!user) {
    user = new User({ username: username });
    await user.save();

    res.status(200).json(user);
  } else {
    res.status(400).send("This user already exists.");
  }
});

app.get("/api/users", (req, res) => {
  User.find()
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(400).send(error));
});


const getDate = (date) => {
  if (!date) {
    return new Date().toDateString();
  }
  const correctDate = new Date();
  const dateString = date.split("-");
  correctDate.setFullYear(dateString[0]);
  correctDate.setDate(dateString[2]);
  correctDate.setMonth(dateString[1] - 1);

  return correctDate.toDateString();
};






const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
