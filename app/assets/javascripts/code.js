/**
 * Created by kristiak on 14.5.2014.
 */

var game = function () {

    var selite = document.getElementById("selite");
    var number = document.getElementById("numero");
    var input = document.getElementById("input");
    var stateElement = document.getElementById("state");

    //var displayNumbers = [ "7", "6", "5", "4", "3"];
    var displayNumbers = [ "7", "6" ];

    var inputChars = [ ];
    var inputIndex = 0;
    
    var states = [ "start", "displayNumbers" ];
    var state = 0;

    var showNumIntervalFunc;

    function getState() {
        return states[state];
    }

    function setState(newState) {
        state = newState;
    }
    
    function doEvent(eventInformation) {
        var curState = getState();

        if (curState == "start") {
            setState("displayNumbers");
            doState();
        }

        else if (curState == "valiVaihe") {
            setState("syotaNumerot");
            doState();
        }

        else if (curState == "syotaNumerot") {
            if (String.fromCharCode(eventInformation.which) == "H") {
                setState("loppuinfo");
                doState();
            } else {
                inputChars[inputIndex++] = String.fromCharCode(eventInformation.which);
            }
        }

        else if (state == "loppuinfo") {

        }

        input.innerHTML = ": " + String.fromCharCode(eventInformation.which);
    }

    function doState() {
        stateElement.innerHTML = state;
        var curState = getState();

        if (getState == "start") {
            selite.innerHTML = "Kohta näytetään numeroita. Paina jotain nappulaa aloittaaksesi";
        }

        if (curState == "displayNumbers") {
            selite.innerHTML = "No nyt tulee!";

            showNumIntervalFunc = setInterval(showNumber, 1000);
        }

        if (curState == "valiVaihe") {
            selite.innerHTML = "Tää on välivaihe! Paina nappulaa niin saat luetella numero!";

        }

        if (curState == "syotaNumerot") {
            selite.innerHTML = "Ny on numeroiden syöttö meneillään! Paine h-näppäintä kun olet valmis!";
        }

        if (curState == "loppuinfo") {
            number.innerHTML = "KUKKUU!";
            var s = "";
            s += "Nää merkit sää laitoit: ";
            for (var i = 0; i < inputChars.length; i++) {
                s += "- " + inputChars[i];
            }
            selite.innerHTML = s;
        }

        function showNumber() {
            if (state == "displayNumbers") {
                if (index == displayNumbers.length) {
                    number.innerHTML = " ";
                    clearInterval(showNumIntervalFunc);
                    setState("valiVaihe");
                    doState();
                } else {
                    number.innerHTML = displayNumbers[index];
                    index++;
                }
            }
        }
    }

    return {
        reset : function () {
            state = states[ "start" ];
            inputChars = [ ];
            inputIndex = 0;
        },
        getState : function () {
            name = newName;
        },
        putEvent : function (eventInformation) {
            doEvent(eventInformation);
        }
    };
}();



$(document).ready(function() {
    var thisGame = new game();
    thisGame.reset();

    $(document).keydown(function(eventInformation) {
        thisGame.putEvent(eventInformation);
    });
});


