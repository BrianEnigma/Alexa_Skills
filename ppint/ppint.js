// If there's an exception for a given year+month, return the day of
// the month that Puzzled Pint falls on, otherwise return 0.
function getPuzzledPintDateException(year, month)
{
    if (2016 == year && 11 == month) // Push back a week from election night
        return 15;
    return 0;
}

// For the given year+month, return the day of the month that the
// second Tuesday falls on.
function calculatePuzzledPintForMonth(year, month)
{
    var d = new Date(year, month - 1, 1, 0, 0, 0, 0);
    var firstDay = d.getDay(); // 0=Sun, 1=Mon, 2=Tue, etc.
    if (firstDay <= 2)
        return 8 + 2 - firstDay;
    else
        return 15 - (firstDay - 2);
    
}

// For the given year+month, first check for an exception and return
// that if it exists, otherwise return the calculated day.
function getPuzzledPintForMonth(year, month)
{
    var result = getPuzzledPintDateException(year, month);
    if (0 == result)
        result = calculatePuzzledPintForMonth(year, month);
    return result;
}

function nextMonth(year, month)
{
    month += 1;
    if (month > 12)
    {
        year += 1;
        month = 1;
    }
    return new Date(year, month - 1, 1, 0, 0, 0, 0);
}

// Get the date of the next Puzzled Pint.
function  getNextPuzzledPint(now)
{
    var ppDay = getPuzzledPintForMonth(now.getFullYear(), now.getMonth() + 1);
    // Has puzzled pint happened this month yet?
    if (now.getDate() <= ppDay)
        return new Date(now.getFullYear(), now.getMonth(), ppDay, 0, 0, 0, 0);
    // Go to the next month.
    now = nextMonth(now.getFullYear(), now.getMonth() + 1);
    ppDay = getPuzzledPintForMonth(now.getFullYear(), now.getMonth() + 1);
    return new Date(now.getFullYear(), now.getMonth(), ppDay, 0, 0, 0, 0);
}

function getNextPuzzledPintAsString(now)
{
    var MONTHS = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    var NICE_DAY = new Array('0th', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd');
    var nextPP = getNextPuzzledPint(now);
    var result = 'The next Puzzled Pint is ';
    // It's this month
    if (now.getFullYear() == nextPP.getFullYear() && now.getMonth() == nextPP.getMonth())
    {
        if (now.getDate() == nextPP.getDate())
            result += 'today.';
        else if (now.getDate() + 1 == nextPP.getDate())
            result += 'tomorrow.';
        else
            result += 'in ' + (nextPP.getDate() - now.getDate()) + ' days, on the ' + NICE_DAY[nextPP.getDate()] + '.';
    }
    // It's next month
    else
    {
        result += 'on Tuesday ' + MONTHS[nextPP.getMonth()] + ' ' + NICE_DAY[nextPP.getDate()] + '.';
    }
    return result;
}

module.exports = {
    getPuzzledPintForMonth: function(year, month) { return getPuzzledPintForMonth(year, month); },
    getNextPuzzledPint: function(year, month) { return getNextPuzzledPint(year, month); },
    getNextPuzzledPintAsString: function(year, month) { return getNextPuzzledPintAsString(year, month); }
};
//console.log(getPuzzledPintForMonth(2016, 1));
//console.log(getNextPuzzledPint(new Date()));
//console.log(getNextPuzzledPint(new Date(2016, 3, 13, 0, 0, 0, 0)));
//console.log(getNextPuzzledPintAsString(new Date(2016, 3, 1, 0, 0, 0, 0)));
//console.log(getNextPuzzledPintAsString(new Date(2016, 3, 11, 0, 0, 0, 0)));
//console.log(getNextPuzzledPintAsString(new Date(2016, 3, 12, 0, 0, 0, 0)));
//console.log(getNextPuzzledPintAsString(new Date(2016, 3, 13, 0, 0, 0, 0)));

