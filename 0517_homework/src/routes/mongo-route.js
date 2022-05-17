const router = require('express').Router();
const { ObjectId } = require('mongodb');
const { mongoConnect } = require('../services/mongo');

router.use((req, res, next) => {
  if (req.query._method === 'DELETE') {
    req.method = 'DELETE';
    req.url = req.path;
  }

  next();
});

router.get('/', async (req, res) => {
  const db = mongoConnect();
  const fetchedTodos = await db.collection('todos').find().toArray();
  const todos = fetchedTodos.map((item) => ({ ID: item._id, ...item }));
  res.render('index', { model: todos });
});

router.get('/create', (req, res) => {
  res.render('create', { model: {} });
});

router.post('/create', async (req, res) => {
  const db = mongoConnect();
  db.collection('todos')
    .insertOne({ Title: req.body.Title })
    .then((result) => {
      console.log('A todo has been added');
      res.redirect('/');
    });
});

router.get('/edit/:id', async (req, res) => {
  const db = mongoConnect();
  const fetchedTodo = await db
    .collection('todos')
    .find({
      _id: ObjectId(req.params.id),
    })
    .toArray();
  res.render('edit', {
    model: { ID: req.params.id, Title: fetchedTodo[0].Title },
  });
});

router.post('/edit/:id', async (req, res) => {
  const db = mongoConnect();
  db.collection('todos')
    .updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: { Title: req.body.Title } },
      { upsert: false }
    )
    .then((result) => {
      console.log('A todo has been updated');
      res.redirect('/');
    });
});

router.delete('/delete/:id', async (req, res) => {
  const db = mongoConnect();
  db.collection('todos')
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then((result) => {
      console.log('A todo has been deleted');
      res.redirect('/');
    });
});

module.exports = router;
