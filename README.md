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

    script/bootstrap

## Running It
Get up and running immediatly with `script/server`.

iTunes API will run on port `8181` by default. Use the `PORT` environment
variable to use your own port.

### Forever
iTunes API has support for [Forever](https://github.com/foreverjs/forever). It uses
`launchd` on OS X to kick it off so that it starts on boot. There is no `init.d`
other Linux support of this type. Pull requests would be welcome for this though.

### Development
You can simply run it by calling `script/server`. This will run it in development
mode with logging to standard out.

### Install as Service on OS X

    script/install

## Logging

iTunes API logs all of its requests. In `production`, it logs to a file at `log/logs.log`.
In `development` mode, it just logs to stdout.

## Development

Launch the app via `script/server` to run it in the development environment.

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
  "volume": 60,
  "muted": false,
  "id": "AC4FFD2271422B47",
  "name": "Forever",
  "artist": "HAIM",
  "album": "Days Are Gone (2013)",
  "playlist": "Summer Jams",
  "shuffle": "songs",
  "repeat": "all"
}
```

#### Playlist Resource

The Playlist resource returns all the information about a playlist in your library.

```json
{
  "id": "outkast-the-90s",
  "name": "Outkast: The '90s",
  "loved": true,
  "duration_in_seconds": 4544,
  "time": "1:15:44"
},
```

#### AirPlayDevice Resource

The AirPlayDevice resource returns all the information about an available
AirPlay device on your network.

```json
{
  "id": "63-22-fa-1f-f5-d4",
  "name": "Living Room",
  "kind": "Apple TV",
  "active": true,
  "selected": true,
  "volume": 60,
  "supports_video": true,
  "supports_audio": true,
  "network_address": "63:22:fa:1f:f5:d4"
}
```

### Methods

These are the endpoints you can hit to do things.

#### Info
  Use these endpoints to query the current state of iTunes.

    GET /now_playing => NowPlayingResource
    GET /artwork => JPEG Data (image/jpeg)

#### Player Control
  Use these endpoints to control what's currently playing.

    PUT /playpause => NowPlayingResource
    PUT /stop => NowPlayingResource
    PUT /previous => NowPlayingResource
    PUT /next => NowPlayingResource
    PUT /play => NowPlayingResource
    PUT /pause => NowPlayingResource
    PUT /volume [level=20] => NowPlayingResource
    PUT /volume [muted=true] => NowPlayingResource
    PUT /shuffle [mode=songs] => NowPlayingResource
    PUT /shuffle [mode=off] => NowPlayingResource
    PUT /repeat [mode=all] => NowPlayingResource
    PUT /repeat [mode=off] => NowPlayingResource


#### Playlists
  Use this endpoint to start a specific playlist.

    GET /playlists => {"playlists": [PlaylistResource, PlaylistResource, ...]}
    PUT /playlists/:id/play => NowPlayingResource

#### AirPlay Control
  Use these endpoints to query and set AirPlay devices. You can set multiple
  AirPlay devices to be used at the same time.

    GET /airplay_devices => {"airplay_devices": [AirPlayDevice, AirPlayDevice, ...]}
    GET /airplay_devices/:id => AirPlayDevice
    PUT /airplay_devices/:id/on => AirPlayDevice
    PUT /airplay_devices/:id/off => AirPlayDevice
    PUT /volume [level=20] => AirPlayDevice

## Contributions

* fork
* create a feature branch
* open a Pull Request
