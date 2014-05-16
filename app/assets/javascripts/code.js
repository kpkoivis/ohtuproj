/**
 * Created by kristiak on 14.5.2014.
 */

var game = {};

game.stmtest = (function() {

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
    game.stmtest.reset();
    game.stmtest.doState();

    $(document).keydown(function(eventInformation) {
        game.stmtest.doEvent(eventInformation);
    });
});


