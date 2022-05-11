const path = require('path');
const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/home', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

router.get('/leave-note', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'leave-note.html'));
});

router.post('/add-note', (req, res, next) => {
  const notes = loadNotes();

  notes.push({
    title: req.body.title,
    content: req.body.content,
  });
  saveNotes(notes);
  res.redirect('/read-note');
});

router.get('/read-note', (req, res, next) => {
  const notes = loadNotes();
  res.render('read-note', { notes: notes });
});

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync('notes.json', dataJSON);
};

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync('notes.json');
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

module.exports = router;
