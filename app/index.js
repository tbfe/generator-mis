'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
//for parsing and manipulate javascript code
var program = require("ast-query");

var assert = yeoman.assert;

module.exports = yeoman.generators.Base.extend({
    initializing: function() {

        // Have Yeoman greet the user.
        this.log(yosay(
            chalk.yellow('TIEBA MIS GENERATOR')
        ));

        this.mis = {};
        this.pkg = require('../package.json');
        //尝试读取deploy-conf.js文件，并且获取模块名，部署路径等，如果是全新模块则会读取失败，这些信息稍后由用户输入
        var deployConfFile = this.expand(this.destinationPath('deploy-conf.js'));
        if (deployConfFile.length > 0) {
            //file exists
            var deployConfTree = program(this.readFileAsString(this.destinationPath('deploy-conf.js')));
            var deployConfBody = deployConfTree.assignment('module.exports').nodes[0].right.properties;
            //host
            this.mis.host = deployConfBody[0].value.value;
            //modName
            this.mis.modName = deployConfBody[1].value.value;
            //subModName
            this.mis.subModName = deployConfBody[2].value.value;

            this.log(
                '检测到deploy-conf.js文件里已有如下信息：\n ' +
                chalk.yellow('host') + ':' + this.mis.host + '\n ' +
                chalk.yellow('modName') + ':' + this.mis.modName + '\n ' +
                chalk.yellow('subModName') + ':' + this.mis.subModName +
                '\n 将以此为基础生成新的项目，你也可以在稍后的提问中进行更改'
            );

            //项目同名的冲突检测先不做，这个概率有点小
            //这里获取到项目名后可以用于之后添加view用
            //进一步检测control文件夹下存在哪些项目，用于后面项目重名时的覆盖提示
            this.existedProjects = [];
            var controlFiles = this.expand(this.destinationPath('control/*.php'));
            controlFiles.forEach(function(v, i, a) {
                this.existedProjects.push(this._.chain(v).strRightBack('/').strLeftBack('.php').underscored().value());
            }.bind(this));

        } else {
            //host
            this.mis.host = '';
            //modName
            this.mis.modName = '';
            //subModName
            this.mis.subModName = '';

            this.log(
                chalk.yellow('没有检测到deploy-conf.js文件，将会生成整个模块需要的所有文件并创建项目')
            );
        }
    },

    prompting: function() {
        var done = this.async();
        //collect some info to setup the project
        var prompts = [{
                type: 'input',
                name: 'author',
                message: '作者（用于生成文件头部的文档）:',
                default: this.user.git.name() || 'tbfe',
                store: true
            }, {
                type: 'input',
                name: 'projectName',
                message: '项目名 (会用来生成主angular模块,control文件及template文件):',
                default: 'Sample'
            },
            // {
            //     type: 'confirm',
            //     name: 'projectNameExists',
            //     message: '已经存在同名项目，如果确定继续将会覆盖原项目',
            //     when: function(anwsers) {
            //         return this.existedProjects.indexOf(this._.underscored(anwsers.projectName)) > -1;

            //     }.bind(this)
            // },
            {
                type: 'input',
                name: 'host',
                message: '部署地址:',
                default: this.mis.host
            }, {
                type: 'confirm',
                name: 'singleMod',
                message: '本项目有父子模块么？',
                default: false,
                when: function() {
                    //如果检测到子模块名，则此项默认为true, 否则为false
                    return !(this.mis.subModName.length > 0);
                }.bind(this)
            }, {
                type: 'confirm',
                name: 'singleMod',
                message: '本项目有父子模块么？',
                default: true,
                when: function() {
                    //如果检测到子模块名，则此项默认为true, 否则为false
                    return this.mis.subModName.length > 0;
                }.bind(this)
            }, {
                type: 'input',
                name: 'modName',
                message: '模块名:',
                when: function(anwsers) {
                    return !anwsers.singleMod;
                },
                default: this.mis.modName,
                validate: function(input) {
                    this.log(this.mis.modName);
                    //如果是新模块，此字段为必需
                    if (!this.mis.modName && !input) {
                        return false;
                    } else {
                        return true;
                    }
                }.bind(this)
            }, {
                type: 'input',
                name: 'modName',
                message: '主模块名:',
                when: function(anwsers) {
                    return anwsers.singleMod;
                },
                default: this.mis.modName,
                validate: function(input) {
                    this.log(this.mis.modName);
                    //如果是新模块，此字段为必需
                    if (!this.mis.modName && !input) {
                        return false;
                    } else {
                        return true;
                    }
                }.bind(this)
            }, {
                type: 'input',
                name: 'subModName',
                message: '子模块名:',
                default: this.mis.subModName,
                when: function(anwsers) {
                    return anwsers.singleMod;
                },
                validate: function(input) {
                    this.log(this.mis.subModName);
                    //如果是新模块，且选择了有父子模块，则此字段也是必需的
                    if (!this.mis.subModName && !input) {
                        return false;
                    } else {
                        return true;
                    }
                }.bind(this)
            }
            //默认生成吧，之后做成主题，由主题来决定是否有侧边菜单
            // , {
            //     type: 'confirm',
            //     name: 'isSidebar',
            //     message: '需要生成侧边菜单么？',
            //     default: true
            // }

            // , {
            //     type: 'list',
            //     name: 'uiFramework',
            //     choices: ['bootstrap', 'angular-material-design (较新，如果你想尝试的话)'],
            //     message: '请选择UI框架',
            //     default: 'bootstrap'
            // }
            , {
                type: 'checkbox',
                name: 'uiPlugins',
                choices: ['sweetalert', 'animate.css'],
                message: '以下插件按需选择'
            }
        ];

        this.prompt(prompts, function(anwsers) {
            this.mis = anwsers;
            this.mis.date = new Date().toISOString().substring(0, 10);
            //如果先把了无父子模块，防止subModName可能会为undefined
            this.mis.subModName = this.mis.subModName || '';

            done();
        }.bind(this));
    },

    writing: {
        app: function() {
            this.fs.copy(
                this.templatePath('_package.json'),
                this.destinationPath('package.json')
            );
            this.fs.copyTpl(
                this.templatePath('_bower.json'),
                this.destinationPath('bower.json'),
                this.mis
            );
        },

        projectfiles: function() {
            var fileBase = this._.underscored(this.mis.projectName);

            //生成bingo空文件夹但angular开发方案中无用
            this.mkdir('data');
            this.mkdir('layout');
            this.mkdir('widget');
            //end

            //复制配置文件
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
            this.fs.copy(
                this.templatePath('jshintrc'),
                this.destinationPath('.jshintrc')
            );
            //end

            //复制编译脚本
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
            //end

            //deploy-conf.js
            this.fs.copyTpl(
                this.templatePath('deploy-conf.js'),
                this.destinationPath('deploy-conf.js'),
                this.mis
            );
            //fis-conf.js
            //如果不是新模块，为了避免覆盖原来的fis-conf.js文件，则不复制
            if (!this.existedProjects) {
                this.fs.copyTpl(
                    this.templatePath('fis-conf.js'),
                    this.destinationPath('fis-conf.js'), {
                        projectName: fileBase
                    }
                );
            }

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
                    projectFoler: fileBase,
                    modName: this.mis.modName,
                    uiPlugins: this.mis.uiPlugins
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
            //默认启用侧边菜单 
            // if (this.mis.isSidebar) {
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

            // } else {
            //    this.mkdir('static/' + fileBase + '/directives');
            //}

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
            }
        }
    },

    install: function() {
        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
    },
    end: function() {
        //将bower安装的文件复制到lib下
        //sweetalert插件
        if (this.mis.uiPlugins.indexOf('sweetalert') > -1) {
            this.fs.copy(
                this.destinationPath('bower_components/sweetalert/lib/sweet-alert.css'),
                this.destinationPath('static/libs/sweetalert/sweet_alert.css')
            );
            this.fs.copy(
                this.destinationPath('bower_components/sweetalert/lib/sweet-alert.js'),
                this.destinationPath('static/libs/sweetalert/sweet_alert.js')
            );
        }

        //animate.css插件
        if (this.mis.uiPlugins.indexOf('animate.css') > -1) {
            this.fs.copy(
                this.destinationPath('bower_components/animate.css/animate.css'),
                this.destinationPath('static/libs/animate.css')
            );
        }

        //angularjs material design
        //因为angular material design还没正式发版，先不加进来
        // if (this.mis.uiPlugins.indexOf('angular-material-design') > -1) {
        //     this.fs.copy(
        //         this.destinationPath('bower_components/angular/angular.js'),
        //         this.destinationPath('static/libs/angularjs/angular.js')
        //     );
        //      this.fs.copy(
        //         this.destinationPath('bower_components/angular-animate/angular-animate.js'),
        //         this.destinationPath('static/libs/angularjs/angular-animate.js')
        //     );
        //      this.fs.copy(
        //         this.destinationPath('bower_components/angular-animate/angular-animate.js'),
        //         this.destinationPath('static/libs/angularjs/angular-animate.js')
        //     );
        // }

        //store user configuration
        this.config.set('author', this.mis.author);
        this.config.set('projectName', this.mis.projectName);

        //ignore bower_components folder
        //在ocean机器上会执行失败，先去掉
        // this.spawnCommand('svn propset svn:ignore bower_components .');

        //say goodbye
        this.log(chalk.green('All done!') + chalk.white('You are ready to go') + '\n' + chalk.green('HAPPY CODING \\(^____^)/'));
    }
});