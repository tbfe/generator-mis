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
            'Welcome dude!' + chalk.yellow('TIEBA MIS GENERATOR')
        ));

        //collect some info to setup the project
        var prompts = [{
            type: 'input',
            name: 'author',
            message: '作者（用于生成文件头部的文档）:',
            default: 'tbfe',
            store: true
        }, {
            type: 'input',
            name: 'projectName',
            message: '项目名 (会用来生成主angular模块,control文件及template文件):',
            default: 'Sample'
        }, {
            type: 'input',
            name: 'host',
            message: '部署地址:',
            default: ''

        }, {
            type: 'confirm',
            name: 'singleMod',
            message: '本项目有父子模块么？',
            default: false
        }, {
            type: 'input',
            name: 'modName',
            message: '模块名:',
            when: function(anwsers) {
                return !anwsers.singleMod;
            },
            default: ''
        }, {
            type: 'input',
            name: 'modName',
            message: '主模块名:',
            when: function(anwsers) {
                return anwsers.singleMod;
            },
            default: ''
        }, {
            type: 'input',
            name: 'subModName',
            message: '子模块名:',
            when: function(anwsers) {
                return anwsers.singleMod;
            },
            default: ''
        }, {
            type: 'confirm',
            name: 'isSidebar',
            message: '需要生成侧边菜单么？',
            default: true
        }];

        this.prompt(prompts, function(anwsers) {
            this.mis = anwsers;
            this.mis.date = new Date().toISOString().substring(0, 10);
            done();
        }.bind(this));
    },

    writing: {
        app: function() {
            // this.fs.copy(
            //     this.templatePath('_package.json'),
            //     this.destinationPath('package.json')
            // );
            // this.fs.copy(
            //     this.templatePath('_bower.json'),
            //     this.destinationPath('bower.json')
            // );
        },

        projectfiles: function() {
            var fileBase = this._.underscored(this.mis.projectName);
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

            //deploy-conf.js
            this.fs.copyTpl(
                this.templatePath('deploy-conf.js'),
                this.destinationPath('deploy-conf.js'),
                this.mis
            );
            //fis-conf.js
            this.fs.copyTpl(
                this.templatePath('fis-conf.js'),
                this.destinationPath('fis-conf.js'), {
                    projectName: fileBase
                }
            );

            //control
            this.fs.copyTpl(
                this.templatePath('control/_control.php'),
                this.destinationPath('control/' + fileBase + '.php'), {
                    date: this.mis.date,
                    author: this.mis.author,
                    projectName: fileBase,
                }
            );
            //template
            this.fs.copyTpl(
                this.templatePath('template/_template.php'),
                this.destinationPath('template/' + fileBase + '/index.php'), {

                    date: this.mis.date,
                    author: this.mis.author,
                    projectName: this._.humanize(this.mis.projectName),
                    modName: this.mis.modName
                }
            );
            //template/index.js
            this.fs.copy(
                this.templatePath('template/_template.js'),
                this.destinationPath('template/' + fileBase + '/index.js')
            );
            //angular app.js
            this.fs.copyTpl(
                this.templatePath('static/project/_app.js'),
                this.destinationPath('static/' + fileBase + '/app.js'), {

                    date: this.mis.date,
                    author: this.mis.author,
                    moduleName: this._.camelize(this.mis.projectName),
                    modName: this.mis.modName
                }
            );

            //resource file
            this.fs.copyTpl(
                this.templatePath('static/project/resources/_resource.js'),
                this.destinationPath('static/' + fileBase + '/resources/resource.js'), {
                    date: this.mis.date,
                    author: this.mis.author,
                    resourceName: this._.classify(this.mis.projectName),
                    projectName: this._.camelize(this.mis.projectName)
                }
            );
            //sidebar directive
            if (this.mis.isSidebar) {
                //sidebar.html
                this.fs.copy(
                    this.templatePath('static/project/directives/sidebar/_sidebar.html'),
                    this.destinationPath('static/' + fileBase + '/directives/sidebar/sidebar.html')
                );

                //sidebar.js
                this.fs.copyTpl(
                    this.templatePath('static/project/directives/sidebar/_sidebar.js'),
                    this.destinationPath('static/' + fileBase + '/directives/sidebar/sidebar.js'), {
                        projectName: this._.camelize(this.mis.projectName)
                    }
                );

            } else {
                this.mkdir('static/' + fileBase + '/directives');
            }

            // sample views
            for (var i = 3; i >= 1; i--) {
                //view template
                this.fs.copy(
                    this.templatePath('static/project/views/view.html'),
                    this.destinationPath('static/' + fileBase + '/views/view' + i + '/view' + i + '.html')
                );
                //view controller
                this.fs.copyTpl(
                    this.templatePath('static/project/views/view.js'),
                    this.destinationPath('static/' + fileBase + '/views/view' + i + '/view' + i + '.js'), {
                        date: this.mis.date,
                        author: this.mis.author,
                        resourceName: this._.classify(this.mis.projectName),
                        projectName: this._.camelize(this.mis.projectName),
                        index: i
                    }
                );
            };
        }
    },

    install: function() {
        // this.installDependencies({
        //     skipInstall: this.options['skip-install']
        // });
    },
    end: function() {
        this.log(chalk.green('All done!') + chalk.blue('You are ready to go') + '\n' + chalk.green('HAPPY CODING \\(^____^)/'));
    }
});