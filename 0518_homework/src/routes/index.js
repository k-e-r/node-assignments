const router = require("express").Router();
const User = require("../models/user");

router.get("/", (req, res) => {
  const { email } = req.session;
  console.log('req.session:',req.session);
  let msg = '';
  let contents = [];

  if (email) {
    msg = `Hello ${email}`;
    contents = [
      { url: '/api/logout', title: 'logout' }
    ]
  } else {
    msg = 'please login/register first';
    contents = [
      { url: '/api/login', title: 'login' },
      { url: '/api/register', title: 'register' }
    ]
  }

  res.render("top", { msg, contents });
});

router.get("/login", (req, res) => {
  const { email } = req.session;
  let contents = [];

  if (email) {
    return res.redirect("/api/admin");
  } else {
    contents = [
      { url: '/api', title: 'top' },
      { url: '/api/register', title: 'register' }
    ]
  }

  res.render("login", { contents });
});

router.post("/login", (req, res) => {
  req.session.email = req.body.email;
  const { email, password } = req.body;

  const user = new User(email, password)
  user.find()
    .then(result => {
      if (result !== null) res.redirect("/api/admin");
  })
  .catch(err => console.error(err))
});

router.get("/register", (req, res) => {
  const { email } = req.session;
  let contents = [];

  if (email) {
    return res.redirect("/api/admin");
  } else {
    contents = [
      { url: '/api', title: 'top' },
      { url: '/api/login', title: 'login' }
    ]
  }

  res.render("register", { contents });
});

router.post("/register", (req, res) => {
  const { email, password } = req.body;

  const user = new User(email, password)
  user.findEmail()
    .then(result => {
      if (result === null) {
        user.save()
        .then(result => {
          res.redirect("/api/login");
        })
        .catch(err => console.error(err))
      }
    })
    .catch(err => console.error(err))
});

router.get("/admin", (req, res) => {
  res.redirect("/api");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.error(err);
    }
    res.redirect("/api/login");
  });
});

module.exports = router;
