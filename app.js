var fs = require('fs')
var path = require('path')
var util = require('util')
var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var iTunes = require('local-itunes')
var osa = require('osa')
var osascript = require(path.join(__dirname, 'node_modules', 'local-itunes', 'node_modules', 'osascript'))
var airplay = require('./lib/airplay')

var app = express()
app.use(bodyParser.urlencoded({ extended: false }))

var logFormat = "'[:date[iso]] - :remote-addr - :method :url :status :response-time ms - :res[content-length]b'"
app.use(morgan(logFormat))

function getCurrentState(){
  itunes = Application('iTunes');
  currentTrack = itunes.currentTrack;
  playerState = itunes.playerState();
  currentState = {};

  currentState['player_state'] = playerState;

  if (playerState != "stopped") {
    currentState['id'] = currentTrack.persistentID();
    currentState['name'] = currentTrack.name();
    currentState['artist'] = currentTrack.artist();
    currentState['album'] = currentTrack.album();

    if (currentTrack.year()) {
      currentState['album'] += " (" + currentTrack.year() + ")";
    }
  }

  return currentState;
}

function sendResponse(error, res){
  if (error) {
    console.log(error)
    res.sendStatus(500)
  }else{
    osa(getCurrentState, function (error, state) {
      console.log(error)
      if (error) {
        res.sendStatus(500)
      }else{
        res.json(state)
      }
    })
  }
}

function playPlaylist(name){
  itunes = Application('iTunes');
  itunes.playlists.byName(name).play();

  return true;
}

function getPlaylists(){
  itunes = Application('iTunes');
  playlists = itunes.playlists();

  playlistNames = [];

  for (var i = 0; i < playlists.length; i++) {
    playlist = playlists[i];
    playlistNames.push({id: playlist.id(), name: playlist.name()});
  }

  return playlistNames;
}

app.put('/play', function(req, res){
  iTunes.play(function (error){
    sendResponse(error, res)
  })
})

app.put('/pause', function(req, res){
  iTunes.pause(function (error){
    sendResponse(error, res)
  })
})

app.put('/playpause', function(req, res){
  iTunes.playpause(function (error){
    sendResponse(error, res)
  })
})

app.put('/stop', function(req, res){
  iTunes.stop(function (error){
    sendResponse(error, res)
  })
})

app.put('/previous', function(req, res){
  iTunes.previous(function (error){
    sendResponse(error, res)
  })
})

app.put('/next', function(req, res){
  iTunes.next(function (error){
    sendResponse(error, res)
  })
})

app.get('/now_playing', function(req, res){
  error = null
  sendResponse(error, res)
})

app.get('/artwork', function(req, res){
  osascript.file(path.join(__dirname, 'lib', 'art.applescript'), function (error, data) {
    res.type('image/jpeg')
    res.sendFile('/tmp/currently-playing.jpg')
  })
})

app.get('/playlists', function (req, res) {
  osa(getPlaylists, function (error, data) {
    if (error){
      console.log(error)
      res.sendStatus(500)
    }else{
      res.json({playlists: data})
    }
  })
})

app.post('/play_playlist', function (req, res) {
  osa(playPlaylist, req.body.playlist, function (error, data) {
    sendResponse(error, res)
  })
})

app.get('/airplay_devices', function(req, res){
  osa(airplay.listAirPlayDevices, function(error, data, log){
    if (error){
      res.sendStatus(500)
    }else{
      res.json({'airplay_devices': data})
    }
  })
})

app.put('/airplay_devices/:id/on', function (req, res) {
  osa(airplay.setSelectionStateAirPlayDevice, req.params.id, true, function(error, data, log){
    if (error){
      console.log(error)
      res.sendStatus(500)
    }else{
      res.json(data)
    }
  })
})

app.put('/airplay_devices/:id/off', function (req, res) {
  osa(airplay.setSelectionStateAirPlayDevice, req.params.id, false, function(error, data, log){
    if (error){
      console.log(error)
      res.sendStatus(500)
    }else{
      res.json(data)
    }
  })
})


app.listen(process.env.PORT || 8181);
