
module.exports = {
  listAirPlayDevices: function (callback){
    itunes = Application('iTunes');
    airPlayDevices = itunes.airplayDevices();
    airPlayResults = [];
    for (i = 0; i < airPlayDevices.length; i++) {
      airPlayDevice = airPlayDevices[i];

      if (!airPlayDevice.networkAddress()) continue;

      deviceData = {};
      deviceData["id"] = airPlayDevice.networkAddress().replace(/:/g, '-');
      deviceData["name"] = airPlayDevice.name();
      deviceData["kind"] = airPlayDevice.kind();
      deviceData["active"] = airPlayDevice.active();
      deviceData["selected"] = airPlayDevice.selected();
      deviceData["sound_volume"] = airPlayDevice.soundVolume();
      deviceData["supports_video"] = airPlayDevice.supportsVideo();
      deviceData["supports_audio"] = airPlayDevice.supportsAudio();
      deviceData["network_address"] = airPlayDevice.networkAddress();

      airPlayResults.push(deviceData);
    }

    return airPlayResults;
  },
  setSelectionStateAirPlayDevice: function (id, selected){
    itunes = Application('iTunes');
    id = id.replace(/-/g, ':');
    foundAirPlayDevice = null;
    deviceData = {};

    airPlayDevices = itunes.airplayDevices();
    for (i = 0; i < airPlayDevices.length; i++) {
      airPlayDevice = airPlayDevices[i];

      if (airPlayDevice.networkAddress() == id){
        foundAirPlayDevice = airPlayDevice;
        break;
      }
    }

    if (foundAirPlayDevice) {
      foundAirPlayDevice.selected = selected;

      deviceData["id"] = foundAirPlayDevice.networkAddress().replace(/:/g, '-');
      deviceData["name"] = foundAirPlayDevice.name();
      deviceData["kind"] = foundAirPlayDevice.kind();
      deviceData["active"] = foundAirPlayDevice.active();
      deviceData["selected"] = foundAirPlayDevice.selected();
      deviceData["sound_volume"] = foundAirPlayDevice.soundVolume();
      deviceData["supports_video"] = foundAirPlayDevice.supportsVideo();
      deviceData["supports_audio"] = foundAirPlayDevice.supportsAudio();
      deviceData["network_address"] = foundAirPlayDevice.networkAddress();
    }

    return deviceData;
  },
  setVolumeAirPlayDevice: function (id, level){
    itunes = Application('iTunes');
    id = id.replace(/-/g, ':');
    foundAirPlayDevice = null;
    deviceData = {};

    airPlayDevices = itunes.airplayDevices();
    for (i = 0; i < airPlayDevices.length; i++) {
      airPlayDevice = airPlayDevices[i];

      if (airPlayDevice.networkAddress() == id){
        foundAirPlayDevice = airPlayDevice;
        break;
      }
    }

    if (foundAirPlayDevice) {
      foundAirPlayDevice.soundVolume = level;

      deviceData["id"] = foundAirPlayDevice.networkAddress().replace(/:/g, '-');
      deviceData["name"] = foundAirPlayDevice.name();
      deviceData["kind"] = foundAirPlayDevice.kind();
      deviceData["active"] = foundAirPlayDevice.active();
      deviceData["selected"] = foundAirPlayDevice.selected();
      deviceData["sound_volume"] = foundAirPlayDevice.soundVolume();
      deviceData["supports_audio"] = foundAirPlayDevice.supportsAudio();
      deviceData["network_address"] = foundAirPlayDevice.networkAddress();
    }

    return deviceData;
  }
}
