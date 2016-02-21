﻿angular.module('variableApp', ['smart-table'])
    .controller('VariableSettingsController', function() {
        var vm = this;
        vm.variables = [];
        vm.displayedVariables = [];
        vm.errorMessage = '';
        vm.selected = {};
        vm.homey;
    
        vm.setHomey = function(homey) {
            vm.homey = homey;
            vm.homey.get('variables', function(err, variables) {
                console.log(variables);
                if (!vm.variables) {
                    vm.variables = [];
                }
                vm.variables = variables;
                vm.displayedVariables = variables;
            });
        }
        vm.addVariable = function() {
            if (vm.variables && vm.variables.filter(function(e) { return e.name == vm.newVariable.name; }).length > 0) {
                vm.errorMessage = "Variable does already exist in database.";
                return;
            }
            var variable = {
                name: vm.newVariable.name,
                type: vm.newVariable.type,
                value: vm.newVariable.value
            };
            vm.variables.push(variable);
            storeVariable(angular.copy(vm.variables), variable.name);
            vm.errorMessage = '';
            vm.newVariable = {}
        };
        vm.deleteAll = function() {
            vm.homey.set('variables', []);
            vm.variables = [];
            vm.displayedVariables = [];
        }
        vm.removeVariable = function (index) {
            var toDeleteVariable = vm.variables[index];
            vm.variables.splice(index, 1);
            storeVariable(vm.variables, toDeleteVariable.name);
        };

        vm.editVariable = function(variable) {
            vm.selected = angular.copy(variable);
        };

        vm.saveVariable = function(idx) {
            vm.variables[idx] = angular.copy(vm.selected);
            console.log(vm.selected);
            vm.displayedVariables = vm.variables;
            storeVariable(vm.variables, vm.selected.name);
            vm.reset();
        };
        vm.reset = function() {
            vm.selected = {};
        };

        vm.selectUpdate = function(type) {
            if (type === 'bool') {
                vm.newVariable.value = false;
                return;
            }
            if (type === 'number') {
                vm.newVariable.value = 0;
                return;
            }
            vm.newVariable.value = '';
            return;
        }

        vm.getTemplate = function(variable) {
            if (variable.name === vm.selected.name && variable.type === vm.selected.type) return 'edit';
            else return 'display';
        };

    function storeVariable(variable, variableName) {
        console.log(variable);
        console.log(variableName);
            vm.homey.set('variables', variable);
            vm.homey.set('changedVariable', variableName);
        }
    });