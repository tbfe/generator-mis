'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var MisGenerator = yeoman.generators.Base.extend({
    // note: arguments and options should be defined in the constructor.
    constructor: function() {
        yeoman.generators.Base.apply(this, arguments);
        // //  This makes` appname` a required argument.
        // this.argument('appname', {
        //     type: String,
        //     required: true,
        //     banner: '整个项目的名称',
        //     desc: '项目名，将会以此名字作为angular主模块的名称，尽量使用简洁的单词或组合'
        // });
        // // And you can then access it later on this way; e.g. CamelCased
        // this.appname = this._.camelize(this.appname);
        // this.log(this.appname);

        this.option('material', {
            desc: 'will u wanna use material design theme?'
        });
        this.option('navnum', {
            type: Number,
            default: 5,
            desc: 'how many menu items'
        });
        this.option('subtitle', {
            type: String,
            default: '',
            desc: 'the subtitle of the site'
        });
        this.log(this.options.material ? 'generate theme with meterial design' : 'generate theme with normal bootstrap');
        this.log('menu with ' + this.options.navnum);
        this.log('and the subtitle is: ' + this.options.subtitle);
    },
    initializing: function() {
        this.pkg = require('../package.json');
    },

    prompting: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome dude! You are using the TIEBA MIS GENERATOR. run ' + chalk.bold.yellow('yo mis --help') + ' for more help'
        ));

        var prompts = [{
            type: 'input',
            name: 'projectName',
            message: '项目名：',
            default: this.appname
        }, {
            type: 'confirm',
            name: 'someOption',
            message: 'Would you like to enable this option?',
            default: true
        }];

        this.prompt(prompts, function(props) {
            this.someOption = props.someOption;

            done();
        }.bind(this));
    },

    writing: {
        app: function() {
            this.dest.mkdir('app');
            this.dest.mkdir('app/templates');

            this.src.copy('_package.json', 'package.json');
            this.src.copy('_bower.json', 'bower.json');
        },

        projectfiles: function() {
            this.src.copy('editorconfig', '.editorconfig');
            this.src.copy('jshintrc', '.jshintrc');
        }
    },

    end: function() {
        this.installDependencies();
    }
});

module.exports = MisGenerator;