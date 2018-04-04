module.exports = function (app) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
      if(req.user) {
        res.redirect('/profile');
      }
      else {
       
        res.render('index.ejs'); // load the index.ejs file
      }
    });
  
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {
      // render the page and pass in any flash data if it exists
      res.render('login.ejs', { message: req.flash('loginMessage') });
    });
  
    // process the login form
    // app.post('/login', do all our passport stuff here);
  
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {
      // render the page and pass in any flash data if it exists
      res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
  
    // process the signup form
    // app.post('/signup', do all our passport stuff here);
  
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
      res.render('profile.ejs', {
        user: req.user // get the user out of session and pass to template
      });
    });

    var moment = require('moment');

module.exports = function(app, database) {

  app.get('/', function (req, res) {
    res.render('todos-index.ejs', {
      user: {
        name: 'Gabriel',
      }
    });
  });

  app.get('/get-todos', function (req, res) {
    database.query(
      `SELECT * FROM todos`, 
      function (error, results, fields) {

      if (error) throw error;

      // console.log('results: ', results);

      res.render('todos.ejs', {
        todos: results
      });
    });
  });

  app.post('/create-todo', function (req, res) {
    
    console.log('data ', req.body);

    var todo = {
      task: req.body.task,
      date: moment().format(),
      complete: false,
      uid: 'sd9f87sdf76s7d6fsdf67sd',
      due_date: moment().add(7, "days").format('YYYY/MM/DD')
    }

    database.query(
      `INSERT INTO todos(task, date, complete, uid, due_date) 
       VALUES('${todo.task}', '${todo.date}', ${todo.complete}, '${todo.uid}', '${todo.due_date}')`, 
      function (error, result, fields) {

        if (error) {
          console.log('error ', error);

          res.send({
            success: false,
            error: error,
            message: 'The todo was not created sorry :('
          });
        }
        else {
          // console.log('result: ', result);
          todo.id = result.insertId;

          res.send({
            success: true,
            todo: todo
          });
        }
    });

  });

  app.post('/update-todo', function (req, res) {
    var id = req.body.id;

    database.query(
      `UPDATE todos SET complete = true WHERE id = ${id}`,
      function (error, result, fields) {

        if (error) {
          console.log('error ', error);

          res.send({
            success: false,
            error: error,
            message: 'The todo was not updated :('
          });
        }
        else {
          console.log('result: ', result);

          res.send({
            success: true,
            id: id
          });
        }

      });
  });

  app.post('/delete-todo', function (req, res) {
    var id = req.body.id;

    database.query(
      `DELETE FROM todos WHERE id = ${id}`,
      function (error, result, fields) {

        if (error) {
          console.log('error ', error);

          res.send({
            success: false,
            error: error,
            message: 'The todo was not deleted :('
          });
        }
        else {
          console.log('result: ', result);
         
          res.send({
            success: true,
            id: id
          });
        }
      });

  });

  app.get('*', function (req, res) {
    res.render('404.ejs');
  });

}
  
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
      req.logout();
      res.redirect('/');
    });
  
    app.get('/password-recovery', function (req, res) {
      res.render('password_recovery.ejs', { message: req.flash('passwordRecoveryMessage') });
    });
  
    app.get('/update-profile', isLoggedIn, function (req, res) {
      res.render('update_profile.ejs', { 
        user: req.user,
        message: req.flash('updateProfileMessage') 
      });
    });
  
    app.get('*', function (req, res) {
      res.render('404.ejs');
    });
  
  };
  
  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
      return next();
  
    // if they aren't redirect them to the home page
    res.redirect('/');
  }