/**
 * Parses date and time inputs and returns a formatted date string.
 * @param {string} dateInput - The date input string (format: "DD/MM/YYYY").
 * @param {string} hourInput - The hour input string (format: "HH:MM").
 * @returns {string} The formatted date string in ISO 8601 format.
 */
function parseAndFormatDate(dateInput, hourInput) {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Check date format DD/MM/YYYY
    const hourRegex = /^\d{2}:\d{2}$/; // Check hour format HH:MM

    if (!dateRegex.test(dateInput)) {
        throw new Error('Le format de la date est invalide, veuillez réessayer en entrant une date valide (DD/MM/YYYY).');
    }

    if (!hourRegex.test(hourInput)) {
        throw new Error('Le format de l\'heure est invalide, veuillez réessayer en entrant une heure valide (HH:MM).');
    }

    const [day, month, year] = dateInput.split('/').map(Number);
    const [hours, minutes] = hourInput.split(':').map(Number);

    const combinedDate = new Date(year, month - 1, day, hours, minutes);

    // Determine if daylight saving time (CEST) is in effect for Paris
    const now = new Date();
    // returns the time zone offset in minutes between the current locale's (the browser's or Node.js environment's) time zone and UTC
    // const isDaylightSavingTimeInParis  = now.getTimezoneOffset() === -120; // 120 minutes = 2 hours (CEST)

    // Set the timezone offset accordingly
    // const timezoneOffset = isDaylightSavingTimeInParis  ? "+02:00" : "+01:00";
    const timezoneOffset = "+02:00";

    const formattedDate = `${combinedDate.getFullYear()}-${String(combinedDate.getMonth() + 1).padStart(2, '0')}-${String(combinedDate.getDate()).padStart(2, '0')}T${String(combinedDate.getHours()).padStart(2, '0')}:${String(combinedDate.getMinutes()).padStart(2, '0')}:${String(combinedDate.getSeconds()).padStart(2, '0')}${timezoneOffset}`;

    return formattedDate;
}

module.exports = { parseAndFormatDate };