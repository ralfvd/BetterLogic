"use strict";

var variables = [];
var newVar;
var receivedVariables = [];
var receivedName = '';
var receivedTempVariables = false;
var receivedVariableName = false;

var self = module.exports = {
    init: function () {
        //Homey.manager('settings').on('set', function(settingsname) { TODO Implement setting change help variable.
        Homey.manager('settings').on('set', function (variableName) {
            if (variableName == 'variables') {
                receivedVariables = Homey.manager("settings").get('variables');
                receivedTempVariables = true;
            }
            if (variableName == 'changedVariable') {
                receivedVariableName = Homey.manager("settings").get('changedVariable');
                receivedVariableName = true;
            }

            if (receivedTempVariables && receivedVariableName) {
                updateVariables();
            }
        });

//Homey.manager('flow').on('trigger.if_variable_changed.variable.autocomplete', function (callback, value) {
//    callback(null, variables.filter(contains(value)));
//});
//Homey.manager('flow').on('condition.if_variable_exists.variable.autocomplete', function (callback, value) {
//    callback(null, variables.filter(contains(value)));
//});
//Homey.manager('flow').on('action.set_string_variable.variable.autocomplete', function (callback, value) {
//    callback(null, variables.filter(filterVariable(value,"string")));
//});
//Homey.manager('flow').on('action.set_number_variable.variable.autocomplete', function (callback, value) {
//    callback(null, variables.filter(filterVariable(value, "number")));
//});
//Homey.manager('flow').on('action.set_bool_variable.variable.autocomplete', function (callback, value) {
//    callback(null, variables.filter(filterVariable(value, "bool")));
//});
//Homey.manager('flow').on('action.flip_bool_variable.variable.autocomplete', function (callback, value) {
//    callback(null, variables.filter(filterVariable(value, "bool")));
//});
//Homey.manager('flow').on('action.increment_number_variable.variable.autocomplete', function (callback, value) {
//    callback(null, variables.filter(filterVariable(value, "number")));
//});
//Homey.manager('flow').on('action.decrement_number_variable.variable.autocomplete', function (callback, value) {
//    callback(null, variables.filter(filterVariable(value, "number")));
//});

        Homey.manager('flow').on('trigger.debug_any_variable_changed', function(callback, args) {
            Homey.log("trigger!!!!!!");
            // if( args.arg_id == 'something' )
            callback(null, true); // true to make the flow continue, or false to abort
        });

        Homey.manager('flow').on('trigger.if_variable_changed', function(callback, args) {
            Homey.log("trigger!!!!!!");
            // if( args.arg_id == 'something' )
            callback(null, true); // true to make the flow continue, or false to abort
        });

        Homey.manager('flow').on('action.set_string_variable', function(callback, args) {
            Homey.log(args);
            UpdateVariable(args.variable, args.value, 'string');
            callback(null, true);
        });


        function UpdateVariable(variable, value, type) {
            Homey.log("create var " + variable);
            Homey.log(variables);
            var foundVar = variables.filter(findVariable(variable, type))[0];
            Homey.log("search old variable");
            if (foundVar) {
                Homey.log("found variable");

                if (foundVar.value === value) {
                    Homey.log("Nothing changed");
                    return;
                }
                Homey.log("remove variable");
                variables.splice(variables.indexOf(foundVar), 1);
            }

            var createdVar = {
                name: variable,
                value: value,
                description: type
            }
            Homey.log("variable created");
            variables.push(createdVar);
            Homey.log("variable pushed");
            newVar = createdVar;

            Homey.manager('flow').trigger('if_variable_changed', { variable: createdVar.variable, value: createdVar.value });
            Homey.manager('flow').trigger('debug_any_variable_changed', { variable: createdVar.name, value: createdVar.value });
            Homey.log("variable triggered");
        }

        function findVariable(partialWord, type) {
            return function(element) {
                return element.name.toLowerCase().indexOf(partialWord.toLowerCase()) > -1 && element.description === type;
            }
        }

        function filterVariable(partialWord, type) {
            return function(element) {
                return element.name.toLowerCase().indexOf(partialWord.query.toLowerCase()) > -1 && element.description === type;
            }
        }


        function contains(partialWord) {
            return function(element) {
                return element.name.toLowerCase().indexOf(partialWord.query.toLowerCase()) > -1;
            }
        }

        function updateVariables() {
            Homey.log(variables);
        }
    }
};