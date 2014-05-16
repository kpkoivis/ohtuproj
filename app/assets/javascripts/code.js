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
    
    var states = [ "start", "displayNumbers", "intersession", "userInput", "endInfo" ];
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



    function doEvent(eventInformation) {
        var curState = getCurrentStateName();

        if (curState == "start") {
            setStateByName("displayNumbers");
            doState();
        }

        else if (curState == "intersession") {
            setStateByName("userInput");
            doState();
        }

        else if (curState == "userInput") {
            if (String.fromCharCode(eventInformation.which) == "H") {
                setStateByName("endInfo");
                doState();
            } else {
                inputChars[inputIndex++] = String.fromCharCode(eventInformation.which);
            }
        }

        else if (state == "endInfo") {

        }

        input.innerHTML = ": " + String.fromCharCode(eventInformation.which);
    }

    function doState() {
        var curState = getCurrentStateName();
        stateElement.innerHTML = curState;

        if (curState == "start") {
            instructions.innerHTML = "Kohta näytetään numeroita. Paina jotain nappulaa aloittaaksesi";
        }

        if (curState == "displayNumbers") {
            instructions.innerHTML = "No nyt tulee!";

            displayIndex = 0;
            showNumIntervalFunc = setInterval(showNumber, 1000);
        }

        if (curState == "intersession") {
            instructions.innerHTML = "Tää on välivaihe! Paina nappulaa niin saat luetella numerot!";

        }

        if (curState == "userInput") {
            instructions.innerHTML = "Ny on numeroiden syöttö meneillään! Paine h-näppäintä kun olet valmis!";
        }

        if (curState == "endInfo") {
            var s = "";
            s += "Nää merkit sää laitoit: ";
            for (var i = 0; i < inputChars.length; i++) {
                s += "- " + inputChars[i];
            }
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
    }

    function reset () {
        setStateByName("start");

        inputChars = [ ];
        inputIndex = 0;

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


