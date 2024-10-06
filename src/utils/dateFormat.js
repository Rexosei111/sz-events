import dayjs, { Dayjs } from "dayjs";

export function formatFrenchDate(date) {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `Inscrit le ${day} ${month} ${year}`;
}

function capitalizeString(str) {
  return `${str.charAt(0).toUpperCase() + str.slice(1)}`;
}

export function getFrenchMonth(dateString) {
  const monthsInFrench = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const date = new Date(dateString);
  const frenchMonth = date.toLocaleString("fr-FR", { month: "long" });
  return capitalizeString(frenchMonth);
}

export function formatDateNumeric(dateString) {
  const datePart = dateString.split("T")[0];
  const [year, month, day] = datePart.split("-");
  return `${day}-${month}-${year}`;
  // const day = String(date.$D).padStart(2, "0");
  // const month = String(date.$M + 1).padStart(2, "0");
  // const year = date.$y;
  // return `${day}-${month}-${year}`;
}

function isLeapYear(year) {
  if (year % 4 === 0) {
    if (year % 100 === 0) {
      return year % 400 === 0;
    }
    return true;
  }
  return false;
}

function getTotalDaysInMonth(month, year) {
  if (month === 2 && isLeapYear(year)) {
    return 29;
  } else if (month === 2) {
    return 28;
  } else if ([4, 6, 9, 11].includes(month)) {
    return 30;
  } else {
    return 31;
  }
}

export function get_datetime_string(dateObject, timeObject) {
  if (dateObject === null) {
    dateObject = new Date();
  }
  if (timeObject === null) {
    timeObject = new Date();
  }
  const combinedDateTime = new Date(
    dateObject.getFullYear(),
    dateObject.getMonth(),
    dateObject.getDate(),
    timeObject.getHours(),
    timeObject.getMinutes(),
    timeObject.getSeconds()
  );

  // Format the combined date-time in ISO 8601 format
  const isoDateTimeString = combinedDateTime.toISOString();
  return isoDateTimeString;
  // Example usage:
}
// const month = 2;
// const year = 2023;
// const totalDays = getTotalDaysInMonth(month, year);
// console.log(`Total days in ${month}/${year}: ${totalDays}`);

export function getWeekendDates() {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const saturday = new Date(currentDate);
  const sunday = new Date(currentDate);

  // Calculate the starting date (Saturday)
  saturday.setDate(currentDate.getDate() + (6 - dayOfWeek));
  saturday.setHours(0, 0, 0, 0);

  // Calculate the ending date (Sunday)
  sunday.setDate(currentDate.getDate() + (7 - dayOfWeek));
  sunday.setHours(23, 59, 59, 999);

  return { start_date: saturday.toISOString(), end_date: sunday.toISOString() };
}

export function getWeekDates() {
  const currentDate = new Date();

  const endOfWeek = new Date(currentDate);

  // Calculate the starting date (Sunday) of the week
  currentDate.setHours(0, 0, 0, 0);

  // Calculate the ending date (Saturday) of the week
  endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    start_date: currentDate.toISOString(),
    end_date: endOfWeek.toISOString(),
  };
}

export function getEndOfDayRange() {
  const currentDate = new Date();

  const endOfDay = new Date(currentDate);

  // Calculate the end of the same day
  endOfDay.setHours(23, 59, 59, 999);

  return {
    start_date: currentDate.toISOString(),
    end_date: endOfDay.toISOString(),
  };
}

export function getMonthToDateRange() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Adding 1 to convert from 0-indexed to 1-indexed month
  const day = currentDate.getDate();

  const startOfMonth = new Date(year, month - 1, day); // Start from the current day in the current month
  const endOfMonth = new Date(year, month, 0); // Setting the day to 0 will give the last day of the current month

  // Adjust the time to the start and end of the day
  startOfMonth.setHours(0, 0, 0, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  return { startOfMonth, endOfMonth };
}

export function formatDateInCustomFormat(dateString) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

export function formatEventDate(inputDateString) {
  // Create a new Date object from the input string
  const inputDate = new Date(inputDateString);

  // Check if the input date is valid
  if (isNaN(inputDate.getTime())) {
    return "Invalid Date";
  }

  // Get the user's current time zone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Format the date in the user's time zone and desired format (without seconds)
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: userTimeZone,
    timeZoneName: "short",
  };
  const formattedDate = inputDate.toLocaleString("en-US", options);

  return formattedDate;
}
