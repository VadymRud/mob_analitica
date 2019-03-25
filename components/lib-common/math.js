module.exports = {round, random};

function round(value, ratio) {
  return Math.round(value * ratio) / ratio;
}  

function random(min, max) {
  return min + Math.random() * (max - min);
}

