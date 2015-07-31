
module.exports = {
  listAirPlayDevices: function (callback){
    itunes = Application('iTunes');
    airPlayDevices = itunes.airplayDevices();
    airPlayResults = [];
    for (i = 0; i < airPlayDevices.length; i++) {
      airPlayDevice = airPlayDevices[i];

      deviceData = {};
      deviceData["id"] = airPlayDevice.id();
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
    airPlayDevice = itunes.airplayDevices.byId(id);
    airPlayDevice.selected = selected;

    deviceData = {};
    deviceData["id"] = airPlayDevice.id();
    deviceData["name"] = airPlayDevice.name();
    deviceData["kind"] = airPlayDevice.kind();
    deviceData["active"] = airPlayDevice.active();
    deviceData["selected"] = airPlayDevice.selected();
    deviceData["soundVolume"] = airPlayDevice.soundVolume();
    deviceData["supportsVideo"] = airPlayDevice.supportsVideo();
    deviceData["supportsAudio"] = airPlayDevice.supportsAudio();
    deviceData["networkAddress"] = airPlayDevice.networkAddress();

    return deviceData;
  }
}
