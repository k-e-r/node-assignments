const uuid = require('uuid');
const router = require('express').Router();
const { client } = require('../services/redis');

router.use((req, res, next) => {
  if (req.query._method === 'DELETE') {
    req.method = 'DELETE';
    req.url = req.path;
  }

  next();
});

router.get('/', async (req, res) => {
  try {
    const todos = [];

    for await (const { field, value } of client.hScanIterator('todos')) {
      todos.push({ ID: field, Title: value });
    }

    res.render('index', { model: todos });
  } catch (e) {
    console.error(e);
  }
});

router.get('/create', (req, res) => {
  res.render('create', { model: {} });
});

router.post('/create', async (req, res) => {
  await client.hSet('todos', uuid.v4(), req.body.Title);
  res.redirect('/');
});

router.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  const todos = await client.hGet('todos', id);
  res.render('edit', { model: { ID: id, Title: todos } });
});

router.post('/edit/:id', async (req, res) => {
  const id = req.params.id;
  await client.hSet('todos', id, req.body.Title);
  res.redirect('/');
});

router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  await client.hDel('todos', id);
  res.redirect('/');
});

module.exports = router;
