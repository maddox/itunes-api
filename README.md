# iTunes API!!

iTunes API is a simple REST server allowing you to query/control a local running
iTunes instance. Once you have a way to make RESTful API calls to control iTunes,
you can integrate its control into any of your own software.

This is especially convenient for integrating into any sort of Home Automation
you might have.

Last confirmed working version of iTunes: `12.2.1`.


## Features

* play/stop/pause/playpause/next/previous control over what's playing.
* query to return what's currently playing.
* fetch the art of the currently playing song.
* set a specific playlist to play, by name.
* query to return a list of available AirPlay endpoints.
* set an AirPlay endpoint to be active. (This can be multiple, since iTunes
  supports it).

## Setup

    npm install
    npm run start

iTunes API will run on port `8181` by default. Use the `PORT` environment
variable to use your own port.

## Docs

This is a quick overview of the service. Read [app.js](app.js) if you need more
info.

### Resources

Here's a list of resources that may be returned in a response.

#### NowPlaying Resource

The NowPlaying resource returns all the information about if iTunes is playing
and what is playing.

```json
{
  "player_state": "playing",
  "id": "AC4FFD2271422B47",
  "name": "Forever",
  "artist": "HAIM",
  "album": "Days Are Gone (2013)"
}
```

#### AirPlayDevice Resource

The AirPlayDevice resource returns all the information about an available
AirPlay device on your network.

```json
{
  "id": 108649,
  "name": "Living Room",
  "kind": "Apple TV",
  "active": true,
  "selected": true,
  "soundVolume": 60,
  "supportsVideo": true,
  "supportsAudio": true,
  "networkAddress": "63:22:fa:1f:f5:d4"
}
```

### Methods

These are the endpoints you can hit to do things.

#### Player Control
  Use these endpoints to control what's currently playing.

    PUT /playpause => NowPlayingResource
    PUT /stop => NowPlayingResource
    PUT /previous => NowPlayingResource
    PUT /next => NowPlayingResource
    PUT /play => NowPlayingResource
    PUT /play => NowPlayingResource

#### Info
  Use these endpoints to query the current state of iTunes.

    GET /now_playing => NowPlayingResource
    GET /artwork => JPEG Data (image/jpeg)

#### Playlist Control
  Use this endpoint to start a specific playlist.

    PUT /play_playlist?playlist="Party%20Time" => NowPlayingResource

#### AirPlay Control
  Use these endpoints to query and set AirPlay devices. You can set multiple
  AirPlay devices to be used at the same time.

    GET /airplay_devices => {:airplay_devices => [AirPlayDevice, AirPlayDevice, ...]}
    PUT /airplay_devices/:id/on => AirPlayDevice
    PUT /airplay_devices/:id/off => AirPlayDevice

## Contributions

* fork
* create a feature branch
* open a Pull Request
