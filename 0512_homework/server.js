const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const res = require('express/lib/response');

/* ---------------------------- setups and config --------------------------- */
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

/* ------------------------------- middleware ------------------------------- */
app.use('/api/members', require('./routes/members'));

app.get('/', (req, res) => res.render('home', { pageTitle: 'homepage' }));

app.use((req, res) => res.render('404', { pageTitle: 'Error 404' }));

/* -------------------------------- listener -------------------------------- */
const PORT = process.env.PORT || 8000;
app.listen(PORT);
