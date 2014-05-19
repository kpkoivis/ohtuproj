/**
 * Created by kristiak on 14.5.2014.
 */


function stateMachine () {
    function state (name, entryFunc, eventFunc) {
        var name = name;
        var entryFunc = entryFunc;
        var eventFunc = eventFunc;

        return {
            name : name,
            entryFunc : entryFunc,
            eventFunc : eventFunc
        };
    }

    function transition (fromState, toState, keys) {
        var fromState = fromState;
        var toState = toState;
        var keys = keys;

        return {
            fromState : fromState,
            toState : toState,
            keys : keys
        };
    }


    var states = [ ];
    var transitions = [ ];
    var curState;


    function reset() {
        curState = 0;
        states[0].entryFunc();
    }

    function getCurrentStateNumber() {
        return curState;
    }

    function getCurrentStateName() {
        return states[getCurrentStateNumber()].name;
    }

    function getStateByName(stateName) {
        for (var i = 0; i < states.length; i++) {
            if (states[i].name == stateName) {
                return states[i];
            }
        }
        return null;
    }

    function enterStateByName(newStateName) {
        for (var i = 0; i < states.length; i++) {
            if (states[i].name == newStateName) {
                curState = i;
                states[i].entryFunc();
            }
        }
    }

    function registerState(newStateName, entryfunction, eventFunction) {
        states.push(new state (newStateName, entryfunction, eventFunction));
    }

    function registerTransition(fromState, toState, keys) {
        transitions.push(new transition(fromState, toState, keys));
    }

    function doEvent(eventInformation) {
        states[curState].eventFunc(eventInformation);
    }

    function transitionToState(stateName) {
        for (var i = 0; i < transitions.length; i++) {
            if (transitions[i].fromState == getCurrentStateName()) {
                if (transitions[i].toState == stateName) {
                    enterStateByName(stateName);
                }
            }
        }
    }

    return {
        reset : reset,
        getCurrentStateNumber : getCurrentStateNumber,
        getCurrentStateName : getCurrentStateName,
        registerState : registerState,
        registerTransition : registerTransition,
        doEvent : doEvent,
        transitionToState : transitionToState
    };
}


var game = {};

game.stmtest = {};




game.stmtest.logic = (function() {


    var texts = {welcome: "Welcome to Short Term Memory Test, press enter to continue",
        start: "You are about to start a short term memory test, press space bar to start",
        input: "Input the numbers in order which they came, after you are ready press space bar",
        inputSeq: "Number sequence as you remembered them",
        testSeq: "Number sequence as it was in the test",
        points: "points for your results: "};


    //var displayNumbers = [ "7", "6", "5", "4", "3"];
    var displayNumbers = [ "7", "6" ];
    var displayIndex;

    var stateM = new stateMachine();

    stateM.registerState("start",           doWhenEnteringStartState,           processEventsInStartState);
    stateM.registerState("displayNumbers",  doWhenEnteringDisplayNumbersState,  processEventsInDisplayNumbersState);
    stateM.registerState("intersession",    doWhenEnteringIntersessionState,    processEventsInIntersessionState);
    stateM.registerState("userInput",       doWhenEnteringUserInputState,       processEventsInUserInputState);
    stateM.registerState("endInfo",         doWhenEnteringEndInfoState,         processEventsInEndInfoState);

    stateM.registerTransition("start", "displayNumbers", " ");
    stateM.registerTransition("displayNumbers", "intersession", "");
    stateM.registerTransition("intersession", "userInput", " ");
    stateM.registerTransition("userInput", "userInput", "0123456789");
    stateM.registerTransition("userInput", "endInfo", "H");
    stateM.registerTransition("endInfo", "start", " ");

    function doWhenEnteringStartState() {
        userInputChars = [ ];
        game.stmtest.ui.setInstructionText("Kohta näytetään numeroita. Paina jotain nappulaa aloittaaksesi");

    }

    function doWhenEnteringDisplayNumbersState() {
        game.stmtest.ui.setInstructionText("No nyt tulee!");

        displayIndex = 0;
        showNumIntervalFunc = setInterval(showNumber, 1000);
    }

    function doWhenEnteringIntersessionState() {
        game.stmtest.ui.setInstructionText("Tää on välivaihe! Paina nappulaa niin saat luetella numerot!");
    }

    function doWhenEnteringUserInputState() {
        game.stmtest.ui.setInstructionText("Ny on numeroiden syöttö meneillään! Paine h-näppäintä kun olet valmis!");
    }

    function doWhenEnteringEndInfoState() {
        var s = "";
        s += "Nää merkit sää laitoit: ";
        for (var i = 0; i < userInputChars.length; i++) {
            s += "- " + userInputChars[i];
        }
        s += " Paina jotain näppäintä jatkaaksesi!";
        game.stmtest.ui.setInstructionText(s);
    }

    function showNumber() {
        if (stateM.getCurrentStateName() == "displayNumbers") {
            if (displayIndex == displayNumbers.length) {
                game.stmtest.ui.setDispNumber(" ");
                clearInterval(showNumIntervalFunc);
                stateM.transitionToState("intersession");
            } else {
                game.stmtest.ui.setDispNumber(displayNumbers[displayIndex]);
                displayIndex++;
            }
        }
    }

    function processEventsInStartState(eventInformation) {
        stateM.transitionToState("displayNumbers");
    }

    function processEventsInDisplayNumbersState(eventInformation) {

    }

    function processEventsInIntersessionState(eventInformation) {
        stateM.transitionToState("userInput");
    }

    function processEventsInUserInputState(eventInformation) {
        if (String.fromCharCode(eventInformation.which) == "H") {
            stateM.transitionToState("endInfo");
        } else {
            userInputChars.push(String.fromCharCode(eventInformation.which));
        }
    }

    function processEventsInEndInfoState(eventInformation) {
        stateM.transitionToState("start");

    }

    function reset () {
        stateM.reset();
    }

    function doEvent(eventInformation) {
        stateM.doEvent(eventInformation);
        $("#input").html(": " + String.fromCharCode(eventInformation.which));
    }

    return {
        reset : reset,
        doEvent : doEvent
    };


})();



game.stmtest.ui = (function() {
    function setInstructionText(text) {
        $( "#instructions").html(text);
    }

    function setDispNumber(number) {
        $( "#dispNumber").html(number);
    }

    return {
        setInstructionText : setInstructionText,
        setDispNumber : setDispNumber
    };

})();


$(document).ready(function() {
    $("#instructions").html("ABOUT TO RESET");
    game.stmtest.logic.reset();

    $(document).keydown(function(eventInformation) {
        game.stmtest.logic.doEvent(eventInformation);
    });
});


