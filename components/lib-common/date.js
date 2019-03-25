const util = require('util');

module.exports = {formatNumberLength, dateUTC, newDateUTC};

function formatNumberLength(num, length) {
  let r = '' + num;
  while (r.length < length) {
    r = '0' + r;
  }
  return r;
}

function newDateUTC(timestamp) {
  let date = new Date(timestamp);
  
  return new Date(
      util.format(
          '%s-%s-%sT%s:%s:%s.%sZ',
          date.getUTCFullYear(),
          formatNumberLength(date.getUTCMonth() + 1, 2),
          formatNumberLength(date.getUTCDate(), 2),
          formatNumberLength(date.getUTCHours(), 2),
          formatNumberLength(date.getUTCMinutes(), 2),
          formatNumberLength(date.getUTCSeconds(), 2),
          formatNumberLength(date.getUTCMilliseconds(), 3)
      )
  );
}

function dateUTC(date) {
  return new Date(
      util.format(
          '%s-%s-%sT%s:%s:%s.%sZ',
          date.getUTCFullYear(),
          formatNumberLength(date.getUTCMonth() + 1, 2),
          formatNumberLength(date.getUTCDate(), 2),
          formatNumberLength(date.getUTCHours(), 2),
          formatNumberLength(date.getUTCMinutes(), 2),
          formatNumberLength(date.getUTCSeconds(), 2),
          formatNumberLength(date.getUTCMilliseconds(), 3)
      )
  );
}
