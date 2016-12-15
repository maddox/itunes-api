var fs = require('fs')
var path = require('path')
var util = require('util')
var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var iTunes = require('local-itunes')
var osa = require('osa')
var osascript = require('osascript')
var airplay = require('./lib/airplay')
var parameterize = require('parameterize');

var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));

var logFormat = "'[:date[iso]] - :remote-addr - :method :url :status :response-time ms - :res[content-length]b'"
app.use(morgan(logFormat))

function getCurrentState(){
  itunes = Application('iTunes');
  playerState = itunes.playerState();
  currentState = {};

  currentState['player_state'] = playerState;

  if (playerState != "stopped") {
    currentTrack = itunes.currentTrack;
    currentPlaylist = itunes.currentPlaylist;

    currentState['id'] = currentTrack.persistentID();
    currentState['name'] = currentTrack.name();
    currentState['artist'] = currentTrack.artist();
    currentState['album'] = currentTrack.album();
    currentState['playlist'] = currentPlaylist.name();
    currentState['volume'] = itunes.soundVolume();
    currentState['muted'] = itunes.mute();
    currentState['repeat'] = itunes.songRepeat();
    currentState['shuffle'] = itunes.shuffleEnabled() && itunes.shuffleMode();

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
      if (error) {
        console.log(error)
        res.sendStatus(500)
      }else{
        res.json(state)
      }
    })
  }
}

function playPlaylist(nameOrId){
  itunes = Application('iTunes');

  if ((nameOrId - 0) == nameOrId && ('' + nameOrId).trim().length > 0) {
    id = parseInt(nameOrId);
    itunes.playlists.byId(id).play();
  }else{
    itunes.playlists.byName(nameOrId).play();
  }

  return true;
}

function setVolume(level){
  itunes = Application('iTunes');

  if (level) {
    itunes.soundVolume = parseInt(level);
    return true;
  }else {
    return false;
  }
}

function setMuted(muted){
  itunes = Application('iTunes');

  if (muted) {
    itunes.mute = muted;
    return true;
  }else{
    return false;
  }
}

function setShuffle(mode){
  itunes = Application('iTunes');

  if (!mode) {
    mode = "songs"
  }

  if (mode == "false" || mode == "off") {
    itunes.shuffleEnabled = false;
    return false;
  }else{
    itunes.shuffleEnabled = true;
    itunes.shuffleMode = mode;
    return true;
  }
}

function setRepeat(mode){
  itunes = Application('iTunes');

  if (!mode) {
    mode = "all"
  }

  if (mode == "false" || mode == "off") {
    itunes.songRepeat = false;
    return false;
  }else{
    itunes.songRepeat = mode;
    return true;
  }
}

function getPlaylistsFromItunes(){
  itunes = Application('iTunes');
  playlists = itunes.playlists();

  playlistNames = [];

  for (var i = 0; i < playlists.length; i++) {
    playlist = playlists[i];

    data = {};
    data['id'] = playlist.id();
    data['name'] = playlist.name();
    data['loved'] = playlist.loved();
    data['duration_in_seconds'] = playlist.duration();
    data['time'] = playlist.time();
    playlistNames.push(data);
  }

  return playlistNames;
}

function getPlaylists(callback){
  osa(getPlaylistsFromItunes, function (error, data) {
    if (error){
      callback(error)
    }else{
      for (var i = 0; i < data.length; i++) {
        data[i]['id'] = parameterize(data[i]['name'])
      }
      callback(null, data)
    }
  })
}

app.get('/_ping', function(req, res){
  res.send('OK');
})

app.get('/', function(req, res){
  res.sendfile('index.html');
})

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

app.put('/volume', function(req, res){
  osa(setVolume, req.body.level, function(error, data, log){
    if (error){
      console.log(error)
      res.sendStatus(500)
    }else{
      sendResponse(error, res)
    }
  })
})

app.put('/mute', function(req, res){
  osa(setMuted, req.body.muted, function(error, data, log){
    if (error){
      console.log(error)
      res.sendStatus(500)
    }else{
      sendResponse(error, res)
    }
  })
})

app.put('/shuffle', function(req, res){
  osa(setShuffle, req.body.mode, function(error, data, log){
    if (error){
      console.log(error)
      res.sendStatus(500)
    }else{
      sendResponse(error, res)
    }
  })
})

app.put('/repeat', function(req, res){
  osa(setRepeat, req.body.mode, function(error, data, log){
    if (error){
      console.log(error)
      res.sendStatus(500)
    }else{
      sendResponse(error, res)
    }
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
  getPlaylists(function (error, data) {
    if (error){
      console.log(error)
      res.sendStatus(500)
    }else{
      res.json({playlists: data})
    }
  })
})

app.put('/playlists/:id/play', function (req, res) {
  osa(getPlaylistsFromItunes, function (error, data) {
    if (error){
      res.sendStatus(500)
    }else{
      for (var i = 0; i < data.length; i++) {
        playlist = data[i]
        if (req.params.id == parameterize(playlist['name'])) {
          osa(playPlaylist, playlist['id'], function (error, data) {
            sendResponse(error, res)
          })
          return
        }
      }
      res.sendStatus(404)
    }
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

app.get('/airplay_devices/:id', function(req, res){
  osa(airplay.listAirPlayDevices, function(error, data, log){
    if (error){
      res.sendStatus(500)
    }else{
      for (var i = 0; i < data.length; i++) {
        device = data[i]
        if (req.params.id == device['id']) {
          res.json(device)
          return
        }
      }
      res.sendStatus(404)
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

app.put('/airplay_devices/:id/volume', function (req, res) {
  osa(airplay.setVolumeAirPlayDevice, req.params.id, req.body.level, function(error, data, log){
    if (error){
      console.log(error)
      res.sendStatus(500)
    }else{
      res.json(data)
    }
  })
})

app.listen(process.env.PORT || 8181);
