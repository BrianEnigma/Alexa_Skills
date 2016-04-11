'use strict';

// If there's an exception for a given year+month, return the day of
// the month that Puzzled Pint falls on, otherwise return 0.
function getPuzzledPintDateException(year, month)
{
    if (2008 == year && 11 == month)
        return 16;
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

//console.log(getPuzzledPintForMonth(2016, 1));
//console.log(getNextPuzzledPint(new Date()));
//console.log(getNextPuzzledPint(new Date(2016, 3, 13, 0, 0, 0, 0)));
//console.log(getNextPuzzledPintAsString(new Date(2016, 3, 1, 0, 0, 0, 0)));
//console.log(getNextPuzzledPintAsString(new Date(2016, 3, 11, 0, 0, 0, 0)));
//console.log(getNextPuzzledPintAsString(new Date(2016, 3, 12, 0, 0, 0, 0)));
//console.log(getNextPuzzledPintAsString(new Date(2016, 3, 13, 0, 0, 0, 0)));

var PPINT_VERSION = "0.91";

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId + " version=" + PPINT_VERSION);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        //if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.4a9597f5-bd5d-4bba-889f-ec173661de28") {
        //     context.fail("Invalid Application ID");
        //}

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request, event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request, event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted version=" + PPINT_VERSION + " requestId=" + sessionStartedRequest.requestId + ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch version=" + PPINT_VERSION + " requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getNextPuzzledPintIntent(launchRequest, session, callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent version=" + PPINT_VERSION + " requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent, intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("NextEvent" === intentName) {
        getNextPuzzledPintIntent(intentRequest, session, callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded version=" + PPINT_VERSION + " requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
}

// --------------- The heavy lifting -----------------------

function getNextPuzzledPintIntent(intent, session, callback)
{
    var cardTitle = "Puzzled Pint"; //intent.name;
    var sessionAttributes = {};
    var repromptText = "";
    var shouldEndSession = true;
    var speechOutput = "";
    
    speechOutput = getNextPuzzledPintAsString(new Date());
    
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

// --------------- Functions that control the skill's behavior -----------------------

// function getWelcomeResponse(callback) {
//     // If we wanted to initialize the session to have some attributes we could add those here.
//     var sessionAttributes = {};
//     var cardTitle = "Welcome";
//     var speechOutput = "Welcome to the Alexa Skills Kit sample. Please tell me your favorite color by saying, my favorite color is red";
//     // If the user either does not reply to the welcome message or says something that is not
//     // understood, they will be prompted again with this text.
//     var repromptText = "Please tell me your favorite color by saying, " +
//         "my favorite color is red";
//     var shouldEndSession = false;
//
//     callback(sessionAttributes,
//         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
// }

// function handleSessionEndRequest(callback) {
//     var cardTitle = "Session Ended";
//     var speechOutput = "Thank you for trying the Alexa Skills Kit sample. Have a nice day!";
//     // Setting this to true ends the session and exits the skill.
//     var shouldEndSession = true;
//
//     callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
// }

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
