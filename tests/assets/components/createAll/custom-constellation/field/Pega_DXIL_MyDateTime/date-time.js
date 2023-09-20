import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime.js';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const types = ["fromNow", "customFormat"];

// value should be in ISO 8601 format.
function DateFormatter(
  value,
  { type = types[1], format = "DD/MM/YYYY", tzone, fieldType } = {}
) {
  if (!value) return value;
  switch (type) {
    case types[1]:
      if (tzone && fieldType !== 'Date') return dayjs(value).tz(tzone).format(format); // Date only value should be formatted without timezone
      return dayjs(value).format(format);
    case types[0]:
      return dayjs(value).from(dayjs());
    default:
      return value;
  }
}
// value should be in hh:mm:ss format (00:00:00 - 23:59:59).
function TimeFormatter(value, options) {
  if (!value) return value;
  const { locale = "en-US" } = options;
  const timeOnlyRegex = /^(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)$/;
  if (value.length === 8 && timeOnlyRegex.test(value)) {
    const { timeOptions = {} } = options;
    const tempDate = new Date();
    const hours = parseInt(value.substr(0, 2), 10);
    const minutes = parseInt(value.substr(3, 2), 10);
    const seconds = parseInt(value.substr(6, 2), 10);
    tempDate.setHours(hours);
    tempDate.setMinutes(minutes);
    tempDate.setSeconds(seconds);
    return tempDate.toLocaleTimeString(locale, timeOptions);
  }
  return DateFormatter(value, options);
}

export const DateTimeShortFormatter = (value, options) => {
  return DateFormatter(value, {
    ...options,
    type: "customFormat",
    format: "MMM DD, YYYY"
  });
}

export default {
  "DateTime-Long": (value, options) =>
    DateFormatter(value, { ...options, type: "customFormat", format: "LLL" }),
  "DateTime-Short": DateTimeShortFormatter,
  "DateTime-Since": (value) => DateFormatter(value, { type: "fromNow" }),
  "Time-Only": (value, options) =>
    TimeFormatter(value, {
      ...options,
      type: "customFormat",
      format: "hh:mm:ss A"
    }),
  convertToTimezone: (value, options) => {
    return value && options && options.timezone
      ? DateFormatter(value, {
          ...options,
          type: "customFormat",
          format: "YYYY-MM-DDTHH:mm:ss"
        })
      : value;
  },
  convertFromTimezone: (value, tzone) =>
  value && tzone
  ? dayjs.tz(value, tzone).utc().format("YYYY-MM-DDTHH:mm:ss[Z]")
  : value,
  Date: (value, options) =>
    DateFormatter(value, { type: "customFormat", ...options }),
  "Date-Default": DateTimeShortFormatter,
  "Date-Time-Default": (value, options) =>
    DateFormatter(value, { ...options, type: "customFormat", format: "lll" }),
  "Time-Default": (value, options) =>
  TimeFormatter(value, {
    ...options,
    type: "customFormat",
    format: "hh:mm A"
  })
};
