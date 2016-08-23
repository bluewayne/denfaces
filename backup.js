var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var xml2js = require('xml2js');

var React = require('react');
var Router = require('react-router');
import { RoutingContext, match } from 'react-router';
var routes = require('./app/routes');
import { render } from 'react-dom';
import { renderToString } from 'react-dom/server';

var mongoose = require('mongoose');
var Character = require('./models/character');
var config = require('./config');
mongoose.connect(config.database);
mongoose.connection.on('error', function () {
    console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

var engines = require('consolidate');
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.set('port', process.env.PORT || '3001');

///////////////////////////////API START

var async = require('async');
var request = require('request');

/**
 * POST /api/characters
 * Adds new character to the database.
 */
app.post('/api/characters', function (req, res, next) {

    console.log('/api/characters    ----');

    var gender = req.body.gender;
    var characterName = req.body.name;

    console.log('req.query.gender     -----:' + req.query.gender);
    console.log('req.query.name     -----:' + req.query.name);

    console.log('req.body.gender     -----:' + req.body.gender);
    console.log('req.body.name     -----:' + req.body.name);


    var characterIdLookupUrl = 'https://api.eveonline.com/eve/CharacterID.xml.aspx?names=' + characterName;

    var parser = new xml2js.Parser();

    async.waterfall([
        function (callback) {

            console.log('characterIdLookupUrl   ---' + characterIdLookupUrl);

            request.get(characterIdLookupUrl, function (err, request, xml) {
                if (err) return next(err);
                parser.parseString(xml, function (err, parsedXml) {
                    if (err) return next(err);
                    try {
                        var characterId = parsedXml.eveapi.result[0].rowset[0].row[0].$.characterID;

                        Character.findOne({characterId: characterId}, function (err, character) {
                            if (err) return next(err);

                            if (character) {
                                return res.status(409).send({message: character.name + ' is already in the database.'});
                            }

                            callback(err, characterId);
                        });
                    } catch (e) {
                        return res.status(400).send({message: 'XML Parse Error'});
                    }
                });
            });
        },
        function (characterId) {
            var characterInfoUrl = 'https://api.eveonline.com/eve/CharacterInfo.xml.aspx?characterID=' + characterId;

            request.get({url: characterInfoUrl}, function (err, request, xml) {
                if (err) return next(err);
                parser.parseString(xml, function (err, parsedXml) {
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

                        character.save(function (err) {
                            if (err) return next(err);
                            res.send({message: characterName + ' has been added successfully!'});
                        });
                    } catch (e) {
                        res.status(404).send({message: characterName + ' is not a registered citizen of New Eden.'});
                    }
                });
            });
        }
    ]);
});

//////////////////////////////API END

app.use(function (req, res) {
        var html = "xx";

        //res.render("index", { htm3: "Hello World3", html2:"hellow world 2"});

        //console.log('req.url-----------:'+req.url);

        // 注意！这里的 req.url 应该是从初始请求中获得的
        // 完整的 URL 路径，包括查询字符串。

        match({routes, location: req.url}, (error, redirectLocation, renderProps) => {
            console.log('req.url-----------:' + req.url);

            //res.render("index", { htm3: "Hello World3", html2:"hellow world 2"});

            if (error) {
                res.status(500).send(error.message)
            } else if (redirectLocation) {
                res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
            } else if (renderProps) {

                //res.send(200, renderToString(<Router.RoutingContext {...renderProps} />))

                var contentFromRouter = renderToString(<RoutingContext {...renderProps} />);

                res.render("index");

            } else {
                res.status(404).send('Page Not found')
            }
        })
    }
)

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var onlineUsers = 0;

io.sockets.on('connection', function (socket) {
    console.log('onlineUsers    ------------------------------------------:' + onlineUsers);

    onlineUsers++;

    io.sockets.emit('onlineUsers', {onlineUsers: onlineUsers});

    socket.on('disconnect', function () {
        onlineUsers--;
        io.sockets.emit('onlineUsers', {onlineUsers: onlineUsers});
    });
});

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
