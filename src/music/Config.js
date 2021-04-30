// config for music.

module.exports = {
  volume: 100,
  stream: {filter: "audioandvideo", highwatermark: 1 << 25},
  leaveOnEnd: true,
  leaveOnEndDelay: 30,
  leaveOnStop: true,
  leaveOnEmpty: true,
  leaveOnEmptyCooldown: 30,
  autoSelfDeaf: true
}