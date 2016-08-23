
var React = require('react');
var Router = require('react-router');
import { RoutingContext, match } from 'react-router';

var routes = require('./app/routes');
import { render } from 'react-dom';
import { renderToString } from 'react-dom/server';
var xml2js = require('xml2js');

var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');
//var users = require('./routes/users');

var mongoose = require('mongoose');
var Character = require('./models/character');
var config = require('./config');
mongoose.connect(config.database);
mongoose.connection.on('error', function() {
    console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});


var app = express();


var engines = require('consolidate');

app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.set('port', process.env.PORT || '3001');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


///////////////////////////////API START

var async = require('async');
var request = require('request');


/**
 * POST /api/characters
 * Adds new character to the database.
 */
app.post('/api/characters', function(req, res, next) {

    console.log('/api/characters    ----');

    var gender = req.body.gender;
    var characterName = req.body.name;
    var characterIdLookupUrl = 'https://api.eveonline.com/eve/CharacterID.xml.aspx?names=' + characterName;

    console.log('characterIdLookupUrl   ----:'+characterIdLookupUrl);

    var parser = new xml2js.Parser();

    async.waterfall([
        function(callback) {
            request.get(characterIdLookupUrl, function(err, request, xml) {
                if (err) return next(err);
                parser.parseString(xml, function(err, parsedXml) {
                    if (err) return next(err);
                    try {
                        var characterId = parsedXml.eveapi.result[0].rowset[0].row[0].$.characterID;

                        Character.findOne({ characterId: characterId }, function(err, character) {
                            if (err) return next(err);

                            if (character) {
                                return res.status(409).send({ message: character.name + ' is already in the database.' });
                            }

                            callback(err, characterId);
                        });
                    } catch (e) {
                        return res.status(400).send({ message: 'XML Parse Error' });
                    }
                });
            });
        },
        function(characterId) {
            var characterInfoUrl = 'https://api.eveonline.com/eve/CharacterInfo.xml.aspx?characterID=' + characterId;

            request.get({ url: characterInfoUrl }, function(err, request, xml) {
                if (err) return next(err);
                parser.parseString(xml, function(err, parsedXml) {
                    if (err) return res.send(err);
                    try {
                        var name = parsedXml.eveapi.result[0].characterName[0];
                        var race = parsedXml.eveapi.result[0].race[0];
                        var bloodline = parsedXml.eveapi.result[0].bloodline[0];

                        var character = new Character({
                            characterId: characterId,
                            name: name,
                            race: race,
                            bloodline: bloodline,
                            gender: gender,
                            random: [Math.random(), 0]
                        });

                        character.save(function(err) {
                            if (err) return next(err);
                            res.send({ message: characterName + ' has been added successfully!' });
                        });
                    } catch (e) {
                        res.status(404).send({ message: characterName + ' is not a registered citizen of New Eden.' });
                    }
                });
            });
        }
    ]);
});

//////////////////////////////API END

app.use(function(req, res) {
        var html="xx";

        //res.render("index", { htm3: "Hello World3", html2:"hellow world 2"});

        //console.log('req.url-----------:'+req.url);

        // 注意！这里的 req.url 应该是从初始请求中获得的
        // 完整的 URL 路径，包括查询字符串。

        match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
            console.log('req.url-----------:'+req.url);

            //res.render("index", { htm3: "Hello World3", html2:"hellow world 2"});

            if (error) {
                res.status(500).send(error.message)
            } else if (redirectLocation) {
                res.status(302).redirect( redirectLocation.pathname + redirectLocation.search)
            } else if (renderProps) {

                //res.send(200, renderToString(<Router.RoutingContext {...renderProps} />))

                var contentFromRouter=renderToString(<RoutingContext {...renderProps} />);

                res.render("index");

            } else {
                res.send(404, 'Not found')
            }
        })
    }
)

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var onlineUsers = 0;

io.sockets.on('connection', function(socket) {
    console.log('onlineUsers    ------------------------------------------:'+onlineUsers);

    onlineUsers++;

    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

    socket.on('disconnect', function() {
        onlineUsers--;
        io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
    });
});

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

//import { renderToString } from 'react-dom/server'
//import { match, RoutingContext } from 'react-router'
////import routes from './routes'
//
//serve((req, res) => {
//    // Note that req.url here should be the full URL path from
//    // the original request, including the query string.
//    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
//        if (error) {
//            res.status(500).send(error.message)
//        } else if (redirectLocation) {
//            res.redirect(302, redirectLocation.pathname + redirectLocation.search)
//        } else if (renderProps) {
//            res.status(200).send(renderToString(<RoutingContext {...renderProps} />))
//        } else {
//            res.status(404).send('Not found')
//        }
//    })

//app.use(function(req, res,next) {
//   Router.run(routes, req.path, function(Handler) {
//
//
//
//      //var html = React.renderToString(React.createElement(Handler));
//      //res.render('views/index.html', {html: html});
//   });
//});


//app.use(function(req, res, next) {
//   var router = Router.create({location: req.url, routes: routes})
//   router.run(function(Handler, state) {
//      var html = React.renderToString(<Handler/>)
//      return res.render('views/index.html', {html: html})
//   })
//})



//app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}

// production error handler
// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});


//module.exports = app;
