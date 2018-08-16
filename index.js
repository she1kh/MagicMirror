const express = require('express');
const socket = require('socket.io');  //pass a http.Server instance
const mongojs = require('mongojs');
const request = require('request');
const bodyParser = require('body-parser');
const nodeSkanetraiken = require('node-skanetrafiken');
const config = require('./assets/config.js');
const Parser = require('rss-parser');
const keys = require('./assets/keys');

//yconst OutlookStrategy = require('passport-outlook').Strategy;

// Init Express & Start the Server
const app = express();
const server = app.listen(3000, () => {
    console.log('Server started on port 3000...');
});

config(app);

// Let the socket listen to the server and 'connection'
const io = socket(server);
io.on('connection', (socket) => {
    console.log('Made contact!', socket.id);
    getDateTime();
    getTodos();
    getTravels();
    getWeather();
    getWeatherForecast();
    getMoto();
    getRSS();
    
});


// Update the date & time every second
setInterval(getDateTime, 1000);             // Varje sekund
setInterval(getTodos, 1000*60);             // Varje minut
setInterval(getTravels, 1000*60);           // Varje minut
setInterval(getMoto, 1000*60);              // Varje minut
setInterval(getWeather, 1000*60*30);        // Varje halvtimme
setInterval(getRSS, 1000*60*60);            // Varje timme


/**
 * 
 * Save weather (Today) 
 */
var db = mongojs('mongodb://' + keys.mLabDB.username + ':' + keys.mLabDB.password + '@ds018848.mlab.com:' + keys.mLabDB.ending);
var dbcity = db.collection('city');
var dbmoto = db.collection('moto');
var dbtodos = db.collection('todo');

/**
 * 
 *  Parse the query from the url
 */
var urlencodedParser = bodyParser.urlencoded({extended: false});
var parser = new Parser();
/**
 * 
 * EJS View Engine
 * Easier to use js and html togheter
 */
app.set('view engine', 'ejs');

// For the front end to use the included files in the view
app.use('/assets', express.static('assets'));
var weather = {};
var todo = {};



/**
 * 
 * Routes for different paths
 */

app.get('/', (req, res) => {
    //get data from mongodb and pass it to the view
      res.render('mirror', { weather: weather, todo : todo});
});

app.post('/', urlencodedParser, (req, res) => {
 
});
/*
app.get('/auth/outlook/callback', 
  passport.authenticate('windowslive', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('config');
  });
*/
 // Users 
 app.get('/Users/:name', (req, res) => {
    var data = {age: 29, job: 'ninja', hobbies: ['chilling', 'fishing', 'eating']};
    res.render('mirror', {person: req.params.name, data:data});
});


// All other routs will give an Error page
app.get('/*', (req, res) => {
    res.render('error');
});

/**
 * Filling the date, time, weather, todo
 * ___________________________________________________________________________
 */


/**
 * Get the current date and time
 */
function getDateTime() {
    var d = new Date();
    var clock = (d.getHours()<10?'0':'') + d.getHours() + ":" + (d.getMinutes()<10?'0':'') + d.getMinutes() + ":" +(d.getSeconds()<10?'0':'') + d.getSeconds();
    var date = d.toLocaleString('en-UK', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    
    var dt = {
            clock : clock,
            date : date
        };
    // Sendig the dt 
    sendtoFront('time', dt);
};

/**
 * Getting the Todos from the DB
 */
function getTodos() {
    dbtodos.find( (err, todo) => {
        if(err){console.log(err);};
        sendtoFront('todos', todo);
    });
};
/**
 * Getting current weather
 */
function getWeather() {
    var city = 'Bunkeflostrand';
    var when = 'weather';
    dbcity.find( (err, data) => {
        if(err){console.log(err);}
        city = data[data.length-1].city;
        request('http://api.openweathermap.org/data/2.5/' + when + '?q=' + city + '&units=metric&appid='+ keys.weahter.weatherKey , {json: true}, (err, res, data) => {
            if (err) {return console.log(err);} 
            sendtoFront('weather', data)
        });
    });
};


function getWeatherForecast() {
    var city = 'Bunkeflostrand';
    var when = 'forecast/daily';
    dbcity.find( (err, data) => {
        if(err){console.log(err);};
        city = data[data.length-1].city;
        request('http://api.openweathermap.org/data/2.5/' + when + '?q=' + city + '&units=metric&appid=' + keys.weahter.weatherKey, {json: true}, (err, res, data) => {
            if (err) {return console.log(err);} 
            sendtoFront('weatherforecast', data)
        });
    });
};

function getTravels() {
    var d= new Date();
    var bussObj = [];
    nodeSkanetraiken.getDepartures({stopID: '80406', date:'180719', time: d.getHours() + ':' + d.getMinutes(), arrivals: true }, function(results, err) {
        
        if (err) { console.log('error : ' + err);}

        for (var i = 0; 10 > i; i++) {
            if (results[i].No == '6' & results[i].StopPoint == 'B' || results[i].No == '4' & results[i].StopPoint == 'C'){ 
                var bussTid = {};
                bussTid.no = results[i].No;                        
                bussTid.dt = results[i].JourneyDateTime;                        
                bussTid.lage = results[i].StopPoint;                        
                bussTid.rikt = results[i].Towards;
                bussObj.push(bussTid);                         
            };
        }
        for (var i = 0; bussObj.length > i; i++) {
                     
        }
        sendtoFront('busstider',bussObj);
    });

}


function getMoto() {
    var motoLine = 'Magic System !';
    dbmoto.find( (err, data) => {
        if(err){console.log(err);};
        motoLine = data[data.length-1].moto;
        sendtoFront('moto', motoLine);
    }); 
}


async function getRSS(){

    var feed = await parser.parseURL('https://www.sydsvenskan.se/rss.xml?latest=1&id=b322c84f-7e97-4af6-a23a-62f61504a910');
    if(feed.items.length > 0){
        sendtoFront('rss', feed);
    }
}
/**
 * 
 * Sending the data to the right js method
 * 
 */
function sendtoFront(msgTo, data) {
    //console.log(msgTo);
    io.sockets.emit(msgTo, data);
}



