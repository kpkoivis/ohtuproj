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
    var stateIndex = 0;

    var transitions = [ ];
    var transitionIndex = 0;

    var state;


    function reset() {
        state = 0;
        states[0].entryFunc();
    }

    function getCurrentStateNumber() {
        return state;
    }

    function getCurrentStateName() {
        var stat = getCurrentStateNumber();
        return states[stat];
    }


    function setStateByNumber(newState) {
        state = newState;
    }

    function setStateByName(newStateName) {
        state = states.indexOf(newStateName);
    }

    function registerState(newStateName, entryfunction, eventFunction) {
        var newState = new state (newStateName, entryfunction, eventFunction);
        states[stateIndex++] = newState;
    }

    function registerTransition(fromState, toState, keys) {
        var newTransition = new transition(fromState, toState, keys);
        transitions[transitionIndex++] = newTransition;
    }

    function doEvent(eventInformation) {
        states[state].eventFunc(eventInformation);
    }

    function transition(stateName) {
        state = 1;
        states[1].entryFunc();
    }

    return {
        reset : reset,
        getCurrentStateNumber : getCurrentStateNumber,
        getCurrentStateName : getCurrentStateName,
        setStateByNumber : setStateByNumber,
        setStateByName : setStateByName,
        registerState : registerState,
        registerTransition : registerTransition,
        doEvent : doEvent,
        transition : transition
    };
}



var game = {};

game.stmtest = {};




game.stmtest.logic = (function() {

    var instructions;
    var number;
    var input;
    var stateElement;
    instructions = $( "#instructions" );
    number = document.getElementById("dispNumber");
    input = document.getElementById("input");
    stateElement = document.getElementById("state");

    var stateM = new stateMachine();

    stateM.registerState("start",           doStateStart, doEventStart);
    stateM.registerState("displayNumbers",  doStateDisplayNumbers, doEventDisplayNumbers);
    stateM.registerState("intersession",    doStateIntersession, doEventIntersession);
    stateM.registerState("userInput",       doStateUserInput, doEventUserInput);
    stateM.registerState("endInfo",         doStateEndInfo, doEventEndInfo);

    stateM.registerTransition("start", "displayNumbers", " ");
    stateM.registerTransition("displayNumbers", "intersession", "");
    stateM.registerTransition("intersession", "userInput", " ");
    stateM.registerTransition("userInput", "userInput", "0123456789");
    stateM.registerTransition("userInput", "endInfo", "H");
    stateM.registerTransition("endInfo", "start", " ");

    function doStateStart() {
        inputChars = [ ];
        inputIndex = 0;
        document.getElementById("instructions").innerHTML = "Kohta näytetään numeroita. Paina jotain nappulaa aloittaaksesi";
    }

    function doStateDisplayNumbers() {
        instructions.innerHTML = "No nyt tulee!";

        displayIndex = 0;
        showNumIntervalFunc = setInterval(showNumber, 1000);
    }

    function doStateIntersession() {
        instructions.innerHTML = "Tää on välivaihe! Paina nappulaa niin saat luetella numerot!";
    }

    function doStateUserInput() {
        instructions.innerHTML = "Ny on numeroiden syöttö meneillään! Paine h-näppäintä kun olet valmis!";
    }

    function doStateEndInfo() {
        var s = "";
        s += "Nää merkit sää laitoit: ";
        for (var i = 0; i < inputChars.length; i++) {
            s += "- " + inputChars[i];
        }
        s += " Paina jotain näppäintä jatkaaksesi!";
        instructions.innerHTML = s;
    }

    function showNumber() {
        if (stateM.getCurrentStateName() == "displayNumbers") {
            if (displayIndex == displayNumbers.length) {
                number.innerHTML = " ";
                clearInterval(showNumIntervalFunc);
                setStateByName("intersession");
                doState();
            } else {
                number.innerHTML = displayNumbers[displayIndex];
                displayIndex++;
            }
        }
    }





    function doEventStart(eventInformation) {
        stateM.transition("displayNumbers");
    }

    function doEventDisplayNumbers(eventInformation) {

    }

    function doEventIntersession(eventInformation) {
        setStateByName("userInput");
        doState();
    }

    function doEventUserInput(eventInformation) {
        if (String.fromCharCode(eventInformation.which) == "H") {
            setStateByName("endInfo");
            doState();
        } else {
            inputChars[inputIndex++] = String.fromCharCode(eventInformation.which);
        }
    }

    function doEventEndInfo(eventInformation) {
        setStateByName("start");
        doState();

    }

    function reset () {
        stateM.reset();


        instructions = document.getElementById("instructions");
        number = document.getElementById("dispNumber");
        input = document.getElementById("input");
        stateElement = document.getElementById("state");
    }

    function doEvent(eventInformation) {
        stateM.doEvent(eventInformation);
        //doEventFunc[getCurrentStateName()](eventInformation);
        input.innerHTML = ": " + String.fromCharCode(eventInformation.which);
    }



    return {
        reset : reset,
        doEvent : doEvent
    };


})();



game.stmtest.ui = (function() {

    var instructions;
    var number;
    var input;
    var stateElement;

    //var displayNumbers = [ "7", "6", "5", "4", "3"];
    var displayNumbers = [ "7", "6" ];
    var displayIndex;

    var inputChars = [ ];
    var inputIndex;

    var doStateFunc = { "start":          doStateStart,
                        "displayNumbers": doStateDisplayNumbers,
                        "intersession":   doStateIntersession,
                        "userInput":      doStateUserInput,
                        "endInfo":        doStateEndInfo
    };

    var doEventFunc = { "start":          doEventStart,
                        "displayNumbers": doEventDisplayNumbers,
                        "intersession":   doEventIntersession,
                        "userInput":      doEventUserInput,
                        "endInfo":        doEventEndInfo
    };

    var states = [  "start", "displayNumbers", "intersession", "userInput", "endInfo" ];
    var state;

    var showNumIntervalFunc;






    function doStateStart() {
        inputChars = [ ];
        inputIndex = 0;
        instructions.innerHTML = "Kohta näytetään numeroita. Paina jotain nappulaa aloittaaksesi";
    }

    function doStateDisplayNumbers() {
        instructions.innerHTML = "No nyt tulee!";

        displayIndex = 0;
        showNumIntervalFunc = setInterval(showNumber, 1000);
    }

    function doStateIntersession() {
        instructions.innerHTML = "Tää on välivaihe! Paina nappulaa niin saat luetella numerot!";
    }

    function doStateUserInput() {
        instructions.innerHTML = "Ny on numeroiden syöttö meneillään! Paine h-näppäintä kun olet valmis!";
    }

    function doStateEndInfo() {
        var s = "";
        s += "Nää merkit sää laitoit: ";
        for (var i = 0; i < inputChars.length; i++) {
            s += "- " + inputChars[i];
        }
        s += " Paina jotain näppäintä jatkaaksesi!";
        instructions.innerHTML = s;
    }

    function showNumber() {
        if (getCurrentStateName() == "displayNumbers") {
            if (displayIndex == displayNumbers.length) {
                number.innerHTML = " ";
                clearInterval(showNumIntervalFunc);
                setStateByName("intersession");
                doState();
            } else {
                number.innerHTML = displayNumbers[displayIndex];
                displayIndex++;
            }
        }
    }





    function doEventStart(eventInformation) {
        setStateByName("displayNumbers");
        doState();
    }

    function doEventDisplayNumbers(eventInformation) {

    }

    function doEventIntersession(eventInformation) {
        setStateByName("userInput");
        doState();
    }

    function doEventUserInput(eventInformation) {
        if (String.fromCharCode(eventInformation.which) == "H") {
            setStateByName("endInfo");
            doState();
        } else {
            inputChars[inputIndex++] = String.fromCharCode(eventInformation.which);
        }
    }

    function doEventEndInfo(eventInformation) {
        setStateByName("start");
        doState();

    }

    function doEvent(eventInformation) {
        doEventFunc[getCurrentStateName()](eventInformation);
        input.innerHTML = ": " + String.fromCharCode(eventInformation.which);
    }


    function doState() {
        stateElement.innerHTML = getCurrentStateName();
        doStateFunc[getCurrentStateName()]();
    }

    function reset () {
        setStateByName("start");

        instructions = document.getElementById("instructions");
        number = document.getElementById("dispNumber");
        input = document.getElementById("input");
        stateElement = document.getElementById("state");
    }

    return {
        reset : reset,
        doState : doState,
        doEvent : doEvent
    };
})();



$(document).ready(function() {
    document.getElementById("state").innerHTML = "ABOUT TO RESET";
    game.stmtest.logic.reset();
    //game.stmtest.logic.start();

    $(document).keydown(function(eventInformation) {
        game.stmtest.logic.doEvent(eventInformation);
    });
});


