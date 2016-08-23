var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var xml2js = require('xml2js');
var _ = require('underscore');

var colors = require('colors');


colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red'
});


var React = require('react');
var Router = require('react-router');
import { RouterContext, match } from 'react-router';
var routes = require('./app/routes');
import { render } from 'react-dom';
import { renderToString } from 'react-dom/server';
import ReactDOM from 'react-dom/server';

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
//app.engine('ejs', engines.mustache);
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || '3001');
///////////////////////////////


var webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpackDevConfig = require('./webpack.config.js');

var compiler = webpack(webpackDevConfig);

console.log('webpackDevConfig.output.publicPath         :'+webpackDevConfig.output.publicPath);

// attach to the compiler & the server
app.use(webpackDevMiddleware(compiler, {

    // public path should be the same with webpack config
    publicPath: webpackDevConfig.output.publicPath,
    noInfo: true,
    stats: {
        colors: true
    }
}));
app.use(webpackHotMiddleware(compiler));

///////////////////////////////API START

var async = require('async');
var request = require('request');

/**
 * POST /api/characters
 * Adds new character to the database.
 */
app.post('/api/characters', function (req, res, next) {

    console.log('/api/characters    ----');

    var gender = req.body.gender;//Post请求用req.body,Get请求用req.query
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


/**
 * GET /api/characters
 * Returns 2 random characters of the same gender that have not been voted yet.
 */
app.get('/api/characters', function (req, res, next) {
    var choices = ['Female', 'Male'];
    var randomGender = _.sample(choices);

    Character.find({random: {$near: [Math.random(), 0]}})
        .where('voted', false)
        .where('gender', randomGender)
        .limit(2)
        .exec(function (err, characters) {
            if (err) return next(err);

            if (characters.length === 2) {
                return res.send(characters);
            }

            var oppositeGender = _.first(_.without(choices, randomGender));

            Character
                .find({random: {$near: [Math.random(), 0]}})
                .where('voted', false)
                .where('gender', oppositeGender)
                .limit(2)
                .exec(function (err, characters) {
                    if (err) return next(err);

                    if (characters.length === 2) {
                        return res.send(characters);
                    }

                    Character.update({}, {$set: {voted: false}}, {multi: true}, function (err) {
                        if (err) return next(err);
                        res.send([]);
                    });
                });
        });
});

//////////////////////

/**
 * PUT /api/characters
 * Update winning and losing count for both characters.
 */
app.put('/api/characters', function (req, res, next) {
    var winner = req.body.winner;
    var loser = req.body.loser;

    console.log('/api/characters put   winner+loser ----:'+winner+'    '+loser);

    if (!winner || !loser) {
        return res.status(400).send({message: 'Voting requires two characters.'});
    }

    if (winner === loser) {
        return res.status(400).send({message: 'Cannot vote for and against the same character.'});
    }

    async.parallel([
            function (callback) {
                Character.findOne({characterId: winner}, function (err, winner) {
                    callback(err, winner);
                });
            },
            function (callback) {
                Character.findOne({characterId: loser}, function (err, loser) {
                    callback(err, loser);
                });
            }
        ],
        function (err, results) {
            if (err) return next(err);

            var winner = results[0];
            var loser = results[1];

            console.log('winner loser'.green);
            console.log('winner loser'+winner+'   '+loser);


            if (!winner || !loser) {
                return res.status(404).send({message: 'One of the characters no longer exists.'});
            }

            if (winner.voted || loser.voted) {
                return res.status(200).end();
            }

            async.parallel([
                function (callback) {
                    winner.wins++;
                    winner.voted = true;
                    winner.random = [Math.random(), 0];
                    winner.save(function (err) {
                        callback(err);
                    });
                },
                function (callback) {
                    loser.losses++;
                    loser.voted = true;
                    loser.random = [Math.random(), 0];
                    loser.save(function (err) {
                        callback(err);
                    });
                }
            ], function (err) {
                if (err) return next(err);
                res.status(200).end();
            });
        });
});

//////////////////////////

/**
 * GET /api/characters/count
 * Returns the total number of characters.
 */
app.get('/api/characters/count', function (req, res, next) {
    Character.count({}, function (err, count) {
        if (err) return next(err);
        res.send({count: count});
    });
});


//////////////////////

/**
 * GET /api/characters/search
 * Looks up a character by name. (case-insensitive)
 */
app.get('/api/characters/search', function (req, res, next) {

    console.log('api/characters/search  ---------');


    var characterName = new RegExp(req.query.name, 'i');

    Character.findOne({name: characterName}, function (err, character) {
        if (err) return next(err);

        if (!character) {
            return res.status(404).send({message: 'Character not found.'});
        }

        res.send(character);
    });
});



/////////////////////////////////////

/**
 * GET /api/characters/top
 * Return 100 highest ranked characters. Filter by gender, race and bloodline.
 */
app.get('/api/characters/top', function (req, res, next) {
    var params = req.query;
    var conditions = {};

    _.each(params, function (value, key) {
        conditions[key] = new RegExp('^' + value + '$', 'i');
    });

    Character
        .find(conditions)
        .sort('-wins') // Sort in descending order (highest wins on top)
        .limit(100)
        .exec(function (err, characters) {
            if (err) return next(err);

            // Sort by winning percentage
            characters.sort(function (a, b) {
                if (a.wins / (a.wins + a.losses) < b.wins / (b.wins + b.losses)) {
                    return 1;
                }
                if (a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)) {
                    return -1;
                }
                return 0;
            });

            res.send(characters);
        });
});


/////////////////////////////

/**
 * GET /api/characters/:id
 * Returns detailed character information.
 */
app.get('/api/characters/:id', function (req, res, next) {

    console.log('characters:id    ------------'.green);
    console.log('req.params.id    ------------'+req.params.id);

    var id = req.params.id;

    Character.findOne({characterId: id}, function (err, character) {
        if (err) return next(err);

        if (!character) {
            return res.status(404).send({message: 'Character not found.'});
        }

        res.send(character);
    });
});


//////////////////////////////////////

/**
 * GET /api/characters/shame
 * Returns 100 lowest ranked characters.
 */
app.get('/api/characters/shame', function (req, res, next) {
    Character
        .find()
        .sort('-losses')
        .limit(100)
        .exec(function (err, characters) {
            if (err) return next(err);
            res.send(characters);
        });
});


////////////////////////////////////////

/**
 * POST /api/report
 * Reports a character. Character is removed after 4 reports.
 */
app.post('/api/report', function (req, res, next) {

    console.log('api/report    --------'.yellow);
    var characterId = req.body.characterId;

    console.log("api/report req.body.characterId   :"+req.body.characterId+''.green);
    console.log('hello'.green);

    Character.findOne({characterId: characterId}, function (err, character) {

        console.log("Character.findOne   err:"+err);

        console.log("Character.findOne   character:"+character);


        if (err) return next(err);

        if (!character) {

            console.log('api/report !character 404  :'.yellow);

            return res.status(404).send({message: 'Character not found.'});
        }

        character.reports++;

        //if (character.reports > 4) {
        //    character.remove();
        //    return res.send({message: character.name + ' has been deleted.'});
        //}

        character.save(function (err) {
            if (err) return next(err);
            res.send({message: character.name + ' has been reported.'});
        });
    });
});


////////////////////////////////////////////


/**
 * GET /api/stats
 * Returns characters statistics.
 */
app.get('/api/stats', function (req, res, next) {
    async.parallel([
            function (callback) {
                Character.count({}, function (err, count) {
                    callback(err, count);
                });
            },
            function (callback) {
                Character.count({race: 'Amarr'}, function (err, amarrCount) {
                    callback(err, amarrCount);
                });
            },
            function (callback) {
                Character.count({race: 'Caldari'}, function (err, caldariCount) {
                    callback(err, caldariCount);
                });
            },
            function (callback) {
                Character.count({race: 'Gallente'}, function (err, gallenteCount) {
                    callback(err, gallenteCount);
                });
            },
            function (callback) {
                Character.count({race: 'Minmatar'}, function (err, minmatarCount) {
                    callback(err, minmatarCount);
                });
            },
            function (callback) {
                Character.count({gender: 'Male'}, function (err, maleCount) {
                    callback(err, maleCount);
                });
            },
            function (callback) {
                Character.count({gender: 'Female'}, function (err, femaleCount) {
                    callback(err, femaleCount);
                });
            },
            function (callback) {
                Character.aggregate({$group: {_id: null, total: {$sum: '$wins'}}}, function (err, totalVotes) {
                        var total = totalVotes.length ? totalVotes[0].total : 0;
                        callback(err, total);
                    }
                );
            },
            function (callback) {
                Character
                    .find()
                    .sort('-wins')
                    .limit(100)
                    .select('race')
                    .exec(function (err, characters) {
                        if (err) return next(err);

                        var raceCount = _.countBy(characters, function (character) {
                            return character.race;
                        });
                        var max = _.max(raceCount, function (race) {
                            return race
                        });
                        var inverted = _.invert(raceCount);
                        var topRace = inverted[max];
                        var topCount = raceCount[topRace];

                        callback(err, {race: topRace, count: topCount});
                    });
            },
            function (callback) {
                Character
                    .find()
                    .sort('-wins')
                    .limit(100)
                    .select('bloodline')
                    .exec(function (err, characters) {
                        if (err) return next(err);

                        var bloodlineCount = _.countBy(characters, function (character) {
                            return character.bloodline;
                        });
                        var max = _.max(bloodlineCount, function (bloodline) {
                            return bloodline
                        });
                        var inverted = _.invert(bloodlineCount);
                        var topBloodline = inverted[max];
                        var topCount = bloodlineCount[topBloodline];

                        callback(err, {bloodline: topBloodline, count: topCount});
                    });
            }
        ],
        function (err, results) {
            if (err) return next(err);

            res.send({
                totalCount: results[0],
                amarrCount: results[1],
                caldariCount: results[2],
                gallenteCount: results[3],
                minmatarCount: results[4],
                maleCount: results[5],
                femaleCount: results[6],
                totalVotes: results[7],
                leadingRace: results[8],
                leadingBloodline: results[9]
            });
        });
});


//////////////////////////////API END

app.use(function (req, res) {
        var html = "xx";

        console.log('req.url-----------app.use' + req.url);

        //res.render("index", { htm3: "Hello World3", html2:"hellow world 2"});

        //console.log('req.url-----------:'+req.url);

        // 注意！这里的 req.url 应该是从初始请求中获得的
        // 完整的 URL 路径，包括查询字符串。

        match({routes, location: req.url}, (error, redirectLocation, renderProps) => {
            console.log('req.url-----------:' + req.url);
            //console.log('req.url-----------:renderProps' + JSON.stringify(renderProps));

            renderProps
            //res.render("index", { htm3: "Hello World3", html2:"hellow world 2"});

            if (error) {
                res.status(500).send(error.message)
            } else if (redirectLocation) {
                res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
            } else if (renderProps) {

                //res.send(200, renderToString(<Router.RoutingContext {...renderProps} />))

                var contentFromRouter = ReactDOM.renderToString(<RouterContext {...renderProps} />);


                //console.log('contentFromRouter  ---------:'+contentFromRouter);

                //res.render("index.ejs",{html3: contentFromRouter});

                res.render("index.ejs",{html3: contentFromRouter});

                //res.send('<!doctype html>\n' +
                //    ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));

            } else {
                res.status(404).send('Page Not found')
            }
        })
    }
)

/////////////////////////////////////////////

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
