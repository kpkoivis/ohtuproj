
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