//FREEDOM MUSCLE APP
//https://www.sitepoint.com/forms-file-uploads-security-node-express/
//welcome to this sandbox playground. Things are still very much in flux

//How to modularize an express app https://stackoverflow.com/questions/9832019/how-to-organize-large-node-js-projects

const fs = require('fs'); //because we want to write static files. 

const alarm = require('alarm');

const accountSid = 'ACa57c27c2ba8ccc15c75bfb712f5d9949';
const authToken = '0c97512ae9be7b5697eb6cc99b1e5406';
const clientTwilio = require('twilio')(accountSid, authToken);

const phone = require('phone')

const defaultTime = '07:00'

// //EXPRESSS

const express = require('express'); //This inports the express.js file from the node_modules. Node appears to assume things in the
//require() function are in node_modules unless otherwise specified. 
const helmet = require('helmet')

const path = require('path') ;//Heroku needs this to run
const PORT = process.env.PORT || 80; //This is the port variable, it accesses a process that is on Heroku, OR it is equal to 80. Set to 3000 instead of 80 if you don't want exposed to local network. 
//To get local network functionality, you just have to use port 80 and set nodejs as a program that is allowed through windows firewall. 

const app = express(); //Enstantiate an express object
app.use(helmet())

function forceHTTPS(req, res, next) {
  if (!req.secure){
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}
app.use(forceHTTPS);
// app.get('/', function (req, res) {
//   res.send('hello world');
// });
const bodyParser = require('body-parser'); //This is needed for reading the body of post request. 

var bcrypt = require('bcrypt');

var exphbs = require('express-handlebars');

app.use(bodyParser.urlencoded({
  extended: true
})); //This configures body parser, https://www.npmjs.com/package/body-parser#bodyparserurlencodedoptions
//Just the way they have it set up. 

app.use(bodyParser.json()); //This also configures the body parser https://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4#24330353
//const bodyParser = require('body-parser')
//app.use(bodyParser);

//Session stuff
//https://www.npmjs.com/package/express-session
const session = require('express-session');
//DATABASE CONFIG

// //LOCAL DATABASE CONFIGURATION
if (app.get('env') === 'development') {
      const { Pool, Client } = require('pg')
  
  var pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'stargarnet',
    password: 'password',
    port: 5432,
  })

  var client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'stargarnet',
    password: 'password',
    port: 5432,
  })
  client.connect()
  ////END LOCAL DATABASE CONFIGURATION
}
else{
  
  var { Pool, Client } = require('pg')

  var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  
  var pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  

  client.connect();
}
  
  // client.query('\
  // CREATE TABLE users (\
  //   id serial PRIMARY KEY,\
  //   username VARCHAR (255) UNIQUE NOT NULL,\
  //   email VARCHAR(255) NOT NULL,\
  //   phone VARCHAR(255) NOT NULL,\
  //   storedhash VARCHAR(255) NOT NULL,\
  //   reviewtime TIME,\
  //   lastupdate TIMESTAMPTZ,\
  //   RoughAlarm TIMESTAMPTZ,\
  //   remindercount int\
  //  );\
  //  \
  //  SET timezone = "America/Los_Angeles";\
  //  \
  //  \
  //  \
  //  --USED FOR SESSION MANAGEMENT: https://github.com/voxpelli/node-connect-pg-simple/blob/HEAD/table.sql\
  //  CREATE TABLE "session" (\
  //    "sid" varchar NOT NULL COLLATE "default",\
  //    "sess" json NOT NULL,\
  //    "expire" timestamp(6) NOT NULL\
  //  )\
  //  WITH (OIDS=FALSE);\
  //  ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;\
  // \
  // \
  // CREATE TABLE goals (\
  //   id serial PRIMARY KEY,\
  //   title VARCHAR (255) UNIQUE NOT NULL,\
  //   username VARCHAR(255) NOT NULL,\
  //   content TEXT,\
  //   lastupdate TIMESTAMPTZ,\
  //   lastreminder TIMESTAMPTZ,\
  //   remindercount int\
  //  );\
  //  ', (err, res) => {
  //   if (err) throw err;
  //   client.end();
  // });

  // client.query('\
  // CREATE TABLE goals (\
  //   id serial PRIMARY KEY,\
  //   title VARCHAR (255) UNIQUE NOT NULL,\
  //   username VARCHAR(255) NOT NULL,\
  //   content TEXT,\
  //   lastupdate TIMESTAMPTZ,\
  //   lastreminder TIMESTAMPTZ,\
  //   remindercount int\
  //   );', (err, res) => {
  //   if (err) throw err;
  //   client.end();
  // });

  pgSession = require('connect-pg-simple')(session); //This all ends up encrypted on the client side. Used wireshark to check. 

var sess = {
  store: new pgSession({
    pool : pool,                // Connection pool
     // Use another table-name than the default "session" one
  }),
  secret: 'keyboard cat',
  cookie: {maxAge:60000*60*24*7},
  resave: false,
  saveUninitialized: true
}
 
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
 
app.use(session(sess))
//END SESSION STARTUP STUFF

//More database stuff https://node-postgres.com/features/queries
// let text = 'INSERT INTO users(users_name, users_email) VALUES($1, $2) RETURNING *' // everything after RETURNING are the columns that you want in what gets returned, use a * for everything. 
// let values = ['sam', 'zach.kohl@gmail.com']

// pool.query(text, values, (err, res) => {
//   if (err) {
//     console.log(err.stack)
//     process.stdout.write('Already have a user by this name')
//   } else {
//     console.log(res.rows[0])
//     // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
//   }
// })


//process.stdout.write(ROWSX[0])

app.engine('handlebars', exphbs({defaultLayout: 'loggedout'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.get('/alt', function (req, res) {
  res.locals.layout = "alt";
  res.render('home');
});

app.use(express.static('static'));


function tableHeader(row1) {
  if (row1){
  string = JSON.stringify(row1)

  string = string.slice(1,(string.length-1)); //cuts off the { } from each end. 
  string = string.replace(/"/g,''); //using the global variable of Regular Expressions
  console.log(string)
  toArray = string.split(',')
  let HeaderArray = [];
  for (let i = 0; i < toArray.length; i++){
    toArray[i] = toArray[i].split(':')
    HeaderArray[i] = toArray[i][0]
  }
  console.log(HeaderArray)
  return HeaderArray;
}
else{
  process.stdout.write('Error: data must have at least one row populated')
    } 
}//end function

function PGtoCSV(rows,filepathAndName) {
  headerArray = tableHeader(rows[0]);
  let forFile =JSON.stringify(headerArray);
  string = '';

  for (let i= 0; i < headerArray.length; i++){
    string = string + headerArray[i].toUpperCase() + ',';
  }
  string = string + "\r\n"
  for (let i = 0; i <rows.length; i++){
    for (let k = 0; k < headerArray.length; k++){
    string = string + rows[i][headerArray[k]] + ',';
    }
    string = string + '\r\n';
  }
  fs.writeFile(filepathAndName, string, (err) => { //https://nodejs.org/docs/latest/api/fs.html#fs_file_system
    if (err) throw err;
    console.log('The file has been saved!');  
})
}; //end of function

//Query
// let text = 'SELECT * from users' // everything after RETURNING are the columns that you want in what gets returned, use a * for everything. 

// pool.query(text, (err, res) => {
//   if (err) {
//     console.log(err.stack)

//   } else {
//     PGtoCSV(res.rows,'csv/output.csv');
    // headerArray = tableHeader(res.rows[0]);
    // let forFile =JSON.stringify(headerArray);
    // string = '';

    // for (let i= 0; i < headerArray.length; i++){
    //   string = string + headerArray[i].toUpperCase() + ',';
    // }
    // string = string + "\r\n"
    // for (let i = 0; i <res.rows.length; i++){
    //   for (let k = 0; k < headerArray.length; k++){
    //   string = string + res.rows[i][headerArray[k]] + ',';
    //   }
    //   string = string + '\r\n';
    // }
    // fs.writeFile('message.csv', string, (err) => { //https://nodejs.org/docs/latest/api/fs.html#fs_file_system
    //   if (err) throw err;
    //   console.log('The file has been saved!');
    // });

//   }
// })//end query



let title = 'Hey';
let message = 'Hello there!';


app.get('/start', function (req, res) { //This is how you render views (views are like templates in Jinga/Flask)
  title = 'Handlebars is a go'
   res.render('start', {title: title}) //Must use this dictonary looking thing, format appears to be [variable used in view]:[current scope variable or a hard coded value]. 
 })

// app.get('/start', function (req, res) { //This is how you render views (views are like templates in Jinga/Flask)
//    res.render('start',{test:'test'}) //Must use this dictonary looking thing, format appears to be [variable used in view]:[current scope variable or a hard coded value]. 
//  })



//app.get('/', (req, res) => res.send('welcome to Stargarnet LLC, this site is under construction')) //This is ES6 notation, it basically shortens the code, Travesty Media explains otherway to do it https://www.youtube.com/watch?v=sB3acNJeNKE&list=PLillGF-RfqbYRpji8t4SxUkMxfowG4Kqp&index=2
// => basically says make a function that takes in the req and res variables that are in the scope of app.get, or app.post, or app.[youGetTheIdea]. The function can now access those variables, in this case we are accessing the res variable with a res.send
//This is how you do stuff in Express
//You can use the arrow notation till life gets complicated, then you must use old school function notation. 
//This function within a parameter is called a CALLBACK. See https://expressjs.com/en/api.html#app.get

 app.post('/start', function(req, res) {  
//   console.log('Username: ' + req.body.username);
//   console.log('Password: ' + req.body.password);
//  res.redirect('/start')
process.stdout.write(req.body.username);
res.redirect('/start')
 });


//Session stuff
//https://www.npmjs.com/package/express-session
//https://www.npmjs.com/package/connect-pg-simple
//https://www.tutorialspoint.com/expressjs/expressjs_authentication.htm (seems very good)

function checkSession(req, res, next) {
  if (req.session.user){ //Does the session exist? Recall that the express-session is using its own id system in the background to hook into a specific user profile. 
    res.locals.layout = "loggedin";
    next(); //https://stackoverflow.com/questions/10695629/what-is-the-parameter-next-used-for-in-express Basically next is a special object in express that passes control to the next MATCHING route
  } else {
    res.redirect('login');
    process.stdout.write('not logged in');

  }
};



////////////////PASSWORD STUFF
//https://www.npmjs.com/package/bcrypt

// const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//   // Store hash in your password DB.
//   process.stdout.write(hash)
// });

// bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
//   // res == true
// });
// bcrypt.compare(someOtherPlaintextPassword, hash, function(err, res) {
//   // res == false
// });

//___________________________REGISTRATION____________________________________

app.get('/register', function (req, res) { //This is how you render views (views are like templates in Jinga/Flask)
  res.render('register') //Must use this dictonary looking thing, format appears to be [variable used in view]:[current scope variable or a hard coded value]. 
})


app.post('/register', function(req, res) {
  if(!req.body.phone){ //phone validation
    res.render('register', { message: 'please enter a valid phone number' })
  }
  else{
  
  bcrypt.hash(req.body.password, 10, function(err, hash) { //This code won't fire till the hash variable is ready, this is called a "callback." Now we will only store things in the database once everything is read to go. 
    if (err) {
      console.log(err)
      process.stdout.write('error hashing password')
    } else{
      
    //Query
    
    phoneNumber = phone(req.body.phone)[0];
    let text = 'INSERT INTO users(username, email, phone,storedHash,reviewtime) VALUES($1, $2, $3, $4, $5) RETURNING *' // everything after RETURNING are the columns that you want in what gets returned, use a * for everything. 
    let values = [req.body.username,req.body.email,phoneNumber,hash,defaultTime]
    
    let response = res; //create a globalish variable. 
    pool.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack)
        process.stdout.write('Already have a user by this name')
        response.redirect('/');
      } else {
        console.log(res.rows[0])
        req.session.user = req.body.username; //NewUser is the username provided by the form.
        response.redirect('/');
      }
    })//end query

    }//end else

  }); //end hashing function
};//end phone validation

});// end app.post

app.get('/login', function (req, res) { 
  res.render('login') 
})


app.post('/login', function(req, res) {
  
 
  req.session.user = req.body.username; //NewUser is the username provided by the form.
//Another example quiery
let text = 'SELECT * FROM users WHERE username = $1' // everything after RETURNING are the columns that you want in what gets returned, use a * for everything. 
let values = [req.body.username]
let response = res; //create a globalish variable. 
pool.query(text, values, (err, res) => {
  if (err) {
    console.log(err.stack)
    process.stdout.write('Username is not registered')
    response.render('login');
  } 
  else {
    if (res.rows[0]) {
    console.log(res.rows[0].id)
    console.log(res.rows[0].storedhash)

    bcrypt.compare(req.body.password, res.rows[0].storedhash, function(err, res) {
      if (err) {
        console.log(err.stack);
        process.stdout.write('error compairing passwords');
        response.render('login');

      } else {
        if(res){
        req.session.user = req.body.username; 
        console.log('login success');
        title = 'login success';
        response.redirect('/');
        //response.render('login');
        }
        else{
          console.log('password fail');
          response.render('login');
        }
        }
     });  
    
    }
    else{
      console.log('search resulted in zero')
      response.render('login');
    }
  }
})//end query

// res.render('login');
//   //res.redirect('secure_page')
//   x = hash;
//   process.stdout.write('post function works');




});// end app.post


app.get('/secure_page', checkSession, function(req, res, next) {  
  res.render('start', { title: 'Secure Page' })
});

app.get('/logout', checkSession, function(req, res, next) {  
  req.session.destroy(); //Deletes the session after the response is read. https://www.npmjs.com/package/express-session


  res.render('start', { title: 'user is logged out' })
});



function query(text, values,callback,) {
  //Query

 
  pool.query(text, values, (err, response) => {
    
    if (err) {
      console.log(err.stack)
      
    } 
    else {
      if (response.rows) {
        callback(response); //must use var because we want function scope. 
      } 
      else {
        console.log('no rows')
      };
      
      };//end else

  })//end query
  
};


app.get('/',checkSession,data=[], function(req, res) {  
  let text = 'SELECT * FROM goals WHERE username = $1' // everything after RETURNING are the columns that you want in what gets returned, use a * for everything. 
  let values = [req.session.user]
  query(text,values,callback);
  function callback(data) {
  res.render('goals',{goals: data, defaultTime: defaultTime})
}


  
});

app.post('/',checkSession, function(req, res) {
//Start query
let text = 'INSERT INTO goals(title,username,content) VALUES($1,$2,$3)' 
let values = [req.body.title,req.session.user,req.body.content]
pool.query(text, values, (err, response) => {  
  if(err){
    console.log(err.stack)
    res.render('goals',{message: 'error in transmission'})
  }//end if
  else{
    res.render('goals',{message: 'data transmitted to the database'})
  }//end else
})//end query

});// end app.post

app.get('/ajax',checkSession,function(req, res){
  let text = 'SELECT * FROM GOALS WHERE username = $1'
  let values = [req.session.user]
  query(text,values,callback);
  function callback(data) {
    res.send(data.rows)
  
  };

});



app.post('/postajax',checkSession,function(req, res){
  let text = 'SELECT EXISTS (SELECT * FROM GOALS WHERE username= $1 AND title = $2)::int'
  let values = [req.session.user,req.body.title]
  query(text,values,callback);
  function callback(data) {
    let x = 0;
    if( data.rows[0].exists == true){

     updateGoal();

    }else{
  
      insertGoal()
    }
  
  };

  function updateGoal(){
    let text = 'UPDATE goals SET LASTUPDATE = $1, CONTENT = $2 WHERE (username = $3 AND title = $4)' 
    let lastupdate = new Date(req.body.timestamp)
    lastupdate = new Date(lastupdate + roughalarm.getTimezoneOffset()*60*1000).toDateString()
    console.log(reviewTime)
    let values = [lastupdate,req.body.content,req.session.user,req.body.title]
    console.log(req.body.timestamp)
    query(text,values,callback);
    function callback() {
    res.send('row updated')
    };
  };

  function insertGoal(){
  let text = 'INSERT INTO goals(TITLE,USERNAME,CONTENT) VALUES ($1,$2,$3)' 
  let values = [req.body.title,req.session.user,req.body.content]
  query(text,values,callback);
  function callback() {
  res.send('row inserted')
  };
};
  
});//end postajax

app.post('/deletegoal',checkSession,function(req, res){
  let text = 'DELETE FROM goals WHERE "username" = $1 AND "title" = $2'
  let values = [req.session.user,req.body.title]
  query(text,values,callback);
  function callback(data) {
  res.send('row deleted')
  };


});

app.post('/ajaxreviewtime',checkSession,function(req, res){
  let text = 'UPDATE users SET reviewtime = $1 WHERE (username = $2)'

  let values = [req.body.reviewTime,req.session.user]
  console.log(req.body.reviewTime)
  query(text,values,callback);
  function callback(data) {
  res.send('review time updated')
  };


});

app.post('/updatetime',checkSession,function(req, res){
  let text = 'SELECT * FROM users WHERE (username = $1)'
  let values = [req.session.user]
  query(text,values,callback);
  function callback(data) {
    
      
      reviewtime =  data.rows[0].reviewtime;
      let roughalarm = new Date().toDateString()  + ' '+ reviewtime; //When the review is due by today
      roughalarm = new Date(roughalarm)
      //roughalarm = new Date(roughalarm.getTime()); //developer mode
      roughalarm = new Date(roughalarm.getTime() + 1000*60*60*24 + roughalarm.getTimezoneOffset()*60*1000); //increment one day
      let text = 'UPDATE users SET lastupdate = $1,roughalarm = $2, remindercount = $3 WHERE (username = $4)'
      let values = [req.body.timestamp,roughalarm,0,req.session.user]
      console.log(req.body.timestamp)
      query(text,values,callback);
      function callback() {
      res.send('review time updated')
      };
    }
  });//end updatetime
  
 



alarm.recurring((1000*5), function() {
  console.log('Hello, world!');
  checkReview();
});

function checkReview(){
  let text = 'SELECT * FROM users'
  let values = [ ]
  query(text,values,callback);
  function callback(data) {
    for (let i= 0; i <  data.rows.length; i++){
      userStuff = data.rows[i]
      let roughalarm =  data.rows[i].roughalarm;
      
    
      let lastupdate = data.rows[i].lastupdate;
      // console.log(lastupdate.toString())
      lastupdate = new Date(lastupdate); //put in JS object
      // console.log(today.toString());
      // console.log(lastUpdate.toString());
      timeNow = new Date();
      if (roughalarm == null){
        console.log('no alarm set for '+userStuff.username)
      }
      else if (roughalarm < timeNow){
        console.log('review is due!')
        console.log(roughalarm);
        console.log(timeNow)
        reviewDue(userStuff);
      }
      else{
        console.log('still got time for '+userStuff.username)
      }
    };//end for loop
  };//end query

  function reviewDue(userStuff){
    currentReminderCount = userStuff.remindercount;
    
    currentAlarm = userStuff.roughalarm;
    newAlarm = new Date();
    if (currentReminderCount== 0){
      newAlarm = new Date(currentAlarm.getTime()+ currentAlarm.getTimezoneOffset()*60*1000 + 1000*15);
      console.log(newAlarm)
textMessage(userStuff.phone,'You need to review your goals https://www.freedommuscle.com');
    } else if ( currentReminderCount== 1){
      newAlarm = new Date(currentAlarm.getTime()+ currentAlarm.getTimezoneOffset()*60*1000 + 1000*60*60*2)
      console.log('1: ' + newAlarm)
textMessage(userStuff.phone,'Goals are important, you committed to this https://www.freedommuscle.com/');
    }else if ( currentReminderCount== 2){
      newAlarm = new Date(currentAlarm.getTime()+ currentAlarm.getTimezoneOffset()*60*1000 + 1000*60*60)
      console.log('2: ' + newAlarm)
textMessage(userStuff.phone,'It won\'t take very long, please review your goals. https://www.freedommuscle.com');

    }else if ( currentReminderCount== 3){
      newAlarm = new Date(currentAlarm.getTime()+ currentAlarm.getTimezoneOffset()*60*1000 + 1000*60*30)
      console.log('3: ' + newAlarm)
textMessage(userStuff.phone,'There is no way you don\'t have internet access, review your goals... https://www.freedommuscle.com');
    }else if ( currentReminderCount== 4){
      newAlarm = new Date(currentAlarm.getTime()+ currentAlarm.getTimezoneOffset()*60*1000 + 1000*60*15)
      console.log('4: ' + newAlarm)
textMessage(userStuff.phone,'Just do it, review goals now https://www.freedommuscle.com');
textMessage('+12087551332','username: '+ userStuff.username + ' has maxed out their goal reminders');
    }else{
      console.log('5: ' + newAlarm)
      newAlarm = new Date(currentAlarm.getTime()+ currentAlarm.getTimezoneOffset()*60*1000 + 1000*60*1)
// textMessage('+12087551332','username: '+ userStuff.username + ' has maxed out their goal reminders');
    }
    currentReminderCount++;
    let text = 'UPDATE users SET roughalarm = $1,remindercount= $2 WHERE (username = $3)'
    let values = [newAlarm,currentReminderCount,userStuff.username]
    query(text,values,callback);
    function callback(data) {
    
    }; //end callback
    function textMessage(userNumber,message){

      clientTwilio.messages
      .create({
         body: message,
         from: '+15098222281',
         to:   userNumber
       })
      .then(message => console.log(message.sid))
      .done();
    };//end TextMessage
  }//end reviewDue


};//end checkReview
//checkReview();


// function textMessage(userNumber,message){

//   clientTwilio.messages
//   .create({
//      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//      from: '+15098222281',
//      to: '+12087551332'
//    })
//   .then(message => console.log(message.sid))
//   .done();
// };//end TextMessage
//textMessage();
app.listen(PORT, () => console.log('Example app listening on port 3000!')) //This listens to the port for incoming traffic, just runs the http.Server.listen(), the regular nodeJS server. See https://expressjs.com/en/api.html#app.listen