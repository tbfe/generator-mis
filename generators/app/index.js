var generators = require('yeoman-generator');
//log colored text
var chalk = require('chalk');

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);
    },
    prompting: function() {
        var done = this.async();

        //arg 1
        this.prompt([{
            type: 'input',
            name: 'name',
            message: 'Your project name',
            default: this.appname, // Default to current folder name
            store: true
        }, {
            type: 'input',
            name: 'age',
            message: 'ur age',
            default: 0
        }], function(answers) {
            this.log('name:'+answers.name,'age:'+chalk.red(answers.age));
            // done();
        }.bind(this));
    }
});