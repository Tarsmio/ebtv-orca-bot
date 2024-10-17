/**
 * Formats a string by replacing whitespaces with "-", removing special characters, and replacing consecutive "-" with a single "-".
 * @param {string} string - The string to be formatted.
 * @returns {string} Returns the formatted string.
 */
function formatingString(string){
    // Replace whitespaces with "-"
    const stringWithoutSpaces = string.replace(/\s+/g, '-');

    const stringWithoutSpacesAndTilde = stringWithoutSpaces.replace(/~/g, '-');

    // Remove special characters like "#"
    const stringWithoutSpecialChars = stringWithoutSpacesAndTilde.replace(/[^\w\s-àèìòùáéíóúýâêîôûãñõäëïöüÿåæœçðÀÈÌÒÙÁÉÍÓÚÝÂÊÎÔÛÃÑÕÄËÏÖÜŸÅÆŒÇ]/g, '');

    // Replace consecutive "-" with a single "-"
    return stringWithoutSpecialChars.replace(/-+/g, '-');
}

/**
 * Checks if the division name corresponds to a valid pick-ban division.
 * @param {string} divisionName - The name of the division to check.
 * @returns {boolean} Returns true if the division name corresponds to a valid pick-ban division, otherwise returns false.
 */
function checkDivPickBan(divisionName){
    const parts = divisionName.split(" ")
    const divNumber = parseInt(parts[1]);

    if(!isNaN(divNumber) && divNumber <= 6){
        return true;
    } else {
        return false;
    }
}

function checkCastTime(dateString){
    const providedDate = new Date(dateString);
    const today = new Date();

    if(providedDate.toDateString() === today.toDateString()) {
        let hour = providedDate.toLocaleTimeString('fr', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' }); //Include the timezone time on the previous date given
        hour = hour.replace(":", "h")
        return `Votre match prévu aujourd'hui à ${hour} va être cast par`;
    } else {
        const parisDateTimezone = providedDate.toLocaleTimeString('fr', { timeZone: 'Europe/Paris', day: '2-digit', month: '2-digit', hour: '2-digit',minute: '2-digit' });
        const date = parisDateTimezone.split(' ')[0];
        let hour = parisDateTimezone.split(' ')[1];
        hour = hour.replace(":", "h")
        return `Votre match prévu le ${date} à ${hour} va être cast par`;
    }
}

function getDayOfWeekWithDate(dateString) {
    let weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    let months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    // Create a new Date object with the specified date
    let date = new Date(dateString);

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    let dayOfWeek = date.getDay();

    // Get the weekday name corresponding to the day of the week
    let weekdayName = weekdays[dayOfWeek];

    // Get the month name
    let monthName = months[date.getMonth()];

    // Get the day of the month
    let dayOfMonth = date.getDate();

    // Construct the string in the format "Weekday Day Month"
    let formattedDate = weekdayName + " " + dayOfMonth  + " " + monthName;

    return formattedDate;
}

module.exports = {
    formatingString,
    getDayOfWeekWithDate,
    checkDivPickBan,
    checkCastTime
}
