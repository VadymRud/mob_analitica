module.exports = {asset};

// function asset(exchange, base, quote, interval) {
//   return ('' + base + '_'+ quote + '_'+ interval + '_'+ exchange).toUpperCase();
// }

function asset(asset) {
  return (asset && asset instanceof Object) 
       ? ('' + asset.base + '_'+ asset.quote + '_'+ asset.interval + '_'+ asset.exchange).toUpperCase()
       : asset;
}


