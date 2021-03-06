/* globals describe,test,expect */

const moment = require('moment-timezone');
const dateParser = require('./dateParser');

describe(`dateParser`, () => {
  test(`custom daily ranges returns day aligned dateRange`, () => {
    expect(dateParser('from 1 days ago to now', 'UTC')).toStrictEqual(
      [dateParser('yesterday', 'UTC')[0], dateParser('today', 'UTC')[1]]
    );
  });

  test(`last 1 day`, () => {
    expect(dateParser('last 1 day', 'UTC')).toStrictEqual(
      [dateParser('yesterday', 'UTC')[0], dateParser('yesterday', 'UTC')[1]]
    );
  });

  test(`today`, () => {
    const start = new Date();
    const end = new Date();
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);
    expect(dateParser('today', 'UTC')).toStrictEqual(
      [start.toISOString().replace('Z', ''), end.toISOString().replace('Z', '')]
    );
  });

  test(`last 6 hours`, () => {
    expect(dateParser('last 6 hours', 'UTC')).toStrictEqual(
      [
        new Date((Math.floor(new Date().getTime() / (1000 * 60 * 60)) - 6) * (1000 * 60 * 60)).toISOString().replace('Z', ''),
        new Date((Math.floor(new Date().getTime() / (1000 * 60 * 60))) * (1000 * 60 * 60) - 1).toISOString().replace('Z', '')
      ]
    );
  });

  test(`from 23 hours ago to now`, () => {
    expect(dateParser('from 23 hours ago to now', 'UTC')).toStrictEqual(
      [
        new Date((Math.floor(new Date().getTime() / (1000 * 60 * 60)) - 23) * (1000 * 60 * 60)).toISOString().replace('Z', ''),
        new Date((Math.ceil(new Date().getTime() / (1000 * 60 * 60))) * (1000 * 60 * 60) - 1).toISOString().replace('Z', '')
      ]
    );
  });

  test(`from 1 hour ago to now LA`, () => {
    const date = new Date();
    const from = moment().tz('America/Los_Angeles').subtract({
      hours: 1,
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      milliseconds: date.getMilliseconds()
    });
    expect(dateParser('from 1 hour ago to now', 'America/Los_Angeles')).toStrictEqual(
      [
        from.format(moment.HTML5_FMT.DATETIME_LOCAL_MS),
        from.clone().add({ hours: 2 }).subtract({ milliseconds: 1 }).format(moment.HTML5_FMT.DATETIME_LOCAL_MS)
      ]
    );
  });

  test(`from 7 days ago to now`, () => {
    expect(dateParser('from 7 days ago to now', 'UTC')).toStrictEqual(
      [dateParser('last 7 days', 'UTC')[0], dateParser('today', 'UTC')[1]]
    );
  });
});
