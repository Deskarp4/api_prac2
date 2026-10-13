var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectId;
var CONTACTS_COLLECTION = "contacts";

var app = express();
var db;

app.use(bodyParser.json());

var distDir = __dirname + "/dist/api-app/browser/";
app.use(express.static(distDir));

function handleError(res, reason, message, code) {
  console.error(reason);
  res.status(code || 500).json({ error: message });
}

app.param("id", function (req, res, next, id) {
  if (!ObjectID.isValid(id)) {
    return res.status(400).json({ error: "Некорректный ID контакта" });
  }
  req.contactId = new ObjectID(id);
  next();
});

function readContact(req, res, next) {
  var body = req.body || {};
  if (typeof body.name !== "string" || !body.name.trim()) {
    return res.status(400).json({ error: "Укажите имя контакта" });
  }

  var phone = body.phone || {};
  req.contactData = {
    name: body.name.trim(),
    email: typeof body.email === "string" ? body.email : "",
    phone: {
      mobile: typeof phone.mobile === "string" ? phone.mobile : "",
      work: typeof phone.work === "string" ? phone.work : "",
    },
  };
  next();
}

app.get("/api/contacts", async function (req, res) {
  var contacts = await db.collection(CONTACTS_COLLECTION).find({}).toArray();
  res.json(contacts);
});

app.post("/api/contacts", readContact, async function (req, res) {
  var contact = req.contactData;
  var result = await db.collection(CONTACTS_COLLECTION).insertOne(contact);
  contact._id = result.insertedId;
  res.status(201).json(contact);
});

app.get("/api/contacts/:id", async function (req, res) {
  var contact = await db.collection(CONTACTS_COLLECTION).findOne({
    _id: req.contactId,
  });
  if (!contact) {
    return res.status(404).json({ error: "Контакт не найден" });
  }
  res.json(contact);
});

app.put("/api/contacts/:id", readContact, async function (req, res) {
  var result = await db.collection(CONTACTS_COLLECTION).updateOne(
    { _id: req.contactId },
    { $set: req.contactData }
  );
  if (result.matchedCount === 0) {
    return res.status(404).json({ error: "Контакт не найден" });
  }
  res.json({ _id: req.contactId, ...req.contactData });
});

app.delete("/api/contacts/:id", async function (req, res) {
  var result = await db.collection(CONTACTS_COLLECTION).deleteOne({
    _id: req.contactId,
  });
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Контакт не найден" });
  }
  res.json({ _id: req.params.id });
});

app.use(function (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  var code = err.status || 500;
  handleError(
    res,
    err.message,
    code === 400 ? "Некорректный JSON в теле запроса" : "Ошибка сервера",
    code
  );
});

mongodb.MongoClient.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/test",
  { serverSelectionTimeoutMS: 5000 }
)
  .then(function (client) {
    db = client.db();
    console.log("База данных подключена");
    var port = Number(process.env.PORT || 8080);
    var server = app.listen(port, function () {
      console.log("Приложение запущено на порту", server.address().port);
    });
    server.on("error", function (err) {
      console.error("Не удалось запустить API:", err.message);
      process.exit(1);
    });
  })
  .catch(function (err) {
    console.error("Не удалось подключиться к MongoDB:", err.message);
    process.exit(1);
  });
