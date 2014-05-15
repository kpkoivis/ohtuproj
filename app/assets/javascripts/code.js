/**
 * Created by kristiak on 14.5.2014.
 */

var game = {};

game.stmtest = (function() {

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

    function getCurrentStateNumber() {
        return [state];
    }

    function getCurrentStateName() {
        return states[getCurrentStateNumber()];
    }
    
    
    
    function setStateNumber(newState) {
        
        state = newState;
    }
    
    function doEvent(eventInformation) {
        var curState = getCurrentStateNumber();

        if (curState == "start") {
            setStateNumber("displayNumbers");
            doState();
        }

        else if (curState == "valiVaihe") {
            setStateNumber("syotaNumerot");
            doState();
        }

        else if (curState == "syotaNumerot") {
            if (String.fromCharCode(eventInformation.which) == "H") {
                setStateNumber("loppuinfo");
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
        var curState = getCurrentStateNumber();
        stateElement.innerHTML = curState;


        if (curState == "start") {
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
            if (curState == "displayNumbers") {
                if (index == displayNumbers.length) {
                    number.innerHTML = " ";
                    clearInterval(showNumIntervalFunc);
                    setStateNumber("valiVaihe");
                    doState();
                } else {
                    number.innerHTML = displayNumbers[index];
                    index++;
                }
            }
        }
    }


    function reset () {
        state = 0;
        inputChars = [ ];
        inputIndex = 0;
        document.getElementById("state").innerHTML = "RESET";
    }



    return {
        reset : reset,
        doState : function () {
            dostate();
        },
        getCurrentStateNumber : function () {
            name = newName;
        },
        putEvent : function (eventInformation) {
            doEvent(eventInformation);
        }
    };
})();



$(document).ready(function() {
    document.getElementById("state").innerHTML = "ABOUT TO RESET";
    //var thisGame = new game();
    game.stmtest.reset();
    game.stmtest.doState();

    $(document).keydown(function(eventInformation) {
        game.stmtest.putEvent(eventInformation);
    });
});


