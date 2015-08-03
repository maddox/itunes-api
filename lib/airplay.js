
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
      deviceData["soundVolume"] = airPlayDevice.soundVolume();
      deviceData["supportsVideo"] = airPlayDevice.supportsVideo();
      deviceData["supportsAudio"] = airPlayDevice.supportsAudio();
      deviceData["networkAddress"] = airPlayDevice.networkAddress();

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

      deviceData["id"] = foundAirPlayDevice.networkAddress();
      deviceData["name"] = foundAirPlayDevice.name();
      deviceData["kind"] = foundAirPlayDevice.kind();
      deviceData["active"] = foundAirPlayDevice.active();
      deviceData["selected"] = foundAirPlayDevice.selected();
      deviceData["soundVolume"] = foundAirPlayDevice.soundVolume();
      deviceData["supportsVideo"] = foundAirPlayDevice.supportsVideo();
      deviceData["supportsAudio"] = foundAirPlayDevice.supportsAudio();
      deviceData["networkAddress"] = foundAirPlayDevice.networkAddress();
    }

    return deviceData;
  }
}
