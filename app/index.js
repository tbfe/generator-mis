'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
    initializing: function() {
        this.pkg = require('../package.json');
    },

    prompting: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome dude! U r using ' + chalk.red('TIEBA MIS') + ' generator.type' + chalk.yellow('\' yo mis --help \'') + 'for tips'
        ));

        var prompts = [{
            type: 'input',
            name: 'author',
            message: 'ur name:',
            default: 'tbfe',
            store: true
        }, {
            type: 'input',
            name: 'projectName',
            message: 'project name (will be used as the main angular module name):',
            default: 'Sample MIS'
        }, {
            type: 'input',
            name: 'host',
            message: 'host to deploy (optional, you can fill this later in deploy-conf.js):',
            default: ''
        }, {
            type: 'input',
            name: 'modName',
            message: 'module name (required):',
        }, {
            type: 'input',
            name: 'subModName',
            message: 'sub module name (optional):',
            default: ''
        }];

        this.prompt(prompts, function(anwsers) {
            this.mis = anwsers;
            this.mis.date = new Date().toISOString().substring(0, 10);
            done();
        }.bind(this));
    },

    writing: {
        app: function() {
            this.fs.copy(
                this.templatePath('_package.json'),
                this.destinationPath('package.json')
            );
            this.fs.copy(
                this.templatePath('_bower.json'),
                this.destinationPath('bower.json')
            );
        },

        projectfiles: function() {
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
            this.fs.copy(
                this.templatePath('jshintrc'),
                this.destinationPath('.jshintrc')
            );


            this.fs.copy(
                this.templatePath('build.sh'),
                this.destinationPath('build.sh')
            );
            this.fs.copy(
                this.templatePath('Makefile'),
                this.destinationPath('Makefile')
            );
            this.fs.copy(
                this.templatePath('readme.txt'),
                this.destinationPath('readme.txt')
            );

            this.fs.copyTpl(
                this.templatePath('deploy-conf.js'),
                this.destinationPath('deploy-conf.js'), {
                    host: this.mis.host,
                    modName: this.mis.modName,
                    subModName: this.mis.subModName
                }
            );

            this.fs.copyTpl(
                this.templatePath('control/_control.php'),
                this.destinationPath('control/control.php'), {
                    author: this.mis.author,
                    projectName: this.mis.projectName,
                    date: this.mis.date
                }
            );
        }
    },

    install: function() {
        // this.installDependencies({
        //     skipInstall: this.options['skip-install']
        // });
    }
});