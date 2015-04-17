'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
//for parsing and manipulate javascript code
var program = require('ast-query');

module.exports = yeoman.generators.Base.extend({
    initializing: function() {
        // Have Yeoman greet the user.
        this.log(yosay(
            chalk.yellow('TIEBA MIS GENERATOR ')
        ));

        this.log('need help? go and open issue: https://github.com/tbfe/generator-mis/issues/new');

        this.mis = {};

        this.pkg = require('../package.json');
        //尝试读取deploy-conf.js文件，并且获取模块名，部署路径等，如果是全新模块则会读取失败，这些信息稍后由用户输入
        var deployConfFile = this.expand(this.destinationPath('deploy-conf.js'));
        if (deployConfFile.length > 0) {
            //file exists
            var deployConfTree = program(this.readFileAsString(this.destinationPath('deploy-conf.js')));
            var deployConfBody = deployConfTree.assignment('module.exports').value();

            //host
            this.mis.host = deployConfBody.key('\'host\'').value();
            //modName
            this.mis.modName = deployConfBody.key('\'modName\'').value();
            //subModName
            this.mis.subModName = deployConfBody.key('\'subModName\'').value();

            this.log(
                '检测到deploy-conf.js文件里已有如下信息：\n ' +
                chalk.yellow('host') + ':' + this.mis.host + '\n ' +
                chalk.yellow('modName') + ':' + this.mis.modName + '\n ' +
                chalk.yellow('subModName') + ':' + this.mis.subModName +
                '\n 将以此为基础生成新的项目，你也可以在稍后的提问中进行更改'
            );

            //这里获取到项目名后可以用于之后添加view用，同时用于后面项目同名冲突的检测
            //进一步检测control文件夹下存在哪些项目，用于后面项目重名时的覆盖提示
            this.existedProjects = [];
            var controlFiles = this.expand(this.destinationPath('control/*.php'));
            controlFiles.forEach(function(v) {
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
            default: this.user.git.name() || process.env.USER || 'tbfe',
            store: true
        }, {
            type: 'input',
            name: 'projectName',
            message: '项目名 (会用来生成主angular模块,control文件及template文件):',
            default: 'Sample',
            validate: function(input) {
                if (this.existedProjects && this.existedProjects.indexOf(this._.underscored(input)) > -1) {
                    return input + ' 已存在！';
                } else {
                    return true;
                }
            }.bind(this)
        }, {
            type: 'list',
            name: 'projectType',
            choices: ['MIS', '平台化MIS', '业务线'],
            message: '项目类型',
            store: true,
            default: 0
        }, {
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
                return this.mis.subModName.length === 0;
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
        }, {
            type: 'input',
            name: 'modDescription',
            message: '模块描述:',
            default: ''
        }, {
            type: 'checkbox',
            name: 'uiPlugins',
            choices: ['bootstrap-material-design', 'sweetalert', 'animate.css', 'highcharts-ng', 'lodash', 'moment', 'ztree'],
            message: '以下插件按需选择(空格进行选择)',
            when: function(anwsers) {
                return anwsers.projectType !== '业务线';
            }
        }];

        this.prompt(prompts, function(anwsers) {
            this.mis = anwsers;
            this.mis.date = new Date().toISOString().substring(0, 10);
            this.mis.goodbyeMsg = chalk.green('All done!\n') + chalk.white('好用再来！') + '\n' + chalk.yellow('HAPPY CODING \\(^____^)/');

            //去掉了主题选项，只有默认主题
            this.mis.theme = 'default';

            //防止subModName可能会为undefined
            this.mis.subModName = this.mis.subModName || '';
            //防止uiPlugins可能会为undefined
            this.mis.uiPlugins = this.mis.uiPlugins || [];

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
            this.fs.copyTpl(
                this.templatePath('_gruntfile.js'),
                this.destinationPath('Gruntfile.js'), {
                    uiPlugins: this.mis.uiPlugins
                }
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
            this.fs.copyTpl(
                this.templatePath('readme.txt'),
                this.destinationPath('readme.txt'),
                this.mis
            );
            //end

            //deploy-conf.js
            this.fs.copyTpl(
                this.templatePath('deploy-conf.js'),
                this.destinationPath('deploy-conf.js'),
                this.mis
            );

            //fis-conf.js
            //新模块则创建该文件，否则更新该文件
            if (!this.existedProjects) {
                this.fs.copyTpl(
                    this.templatePath('fis-conf.js'),
                    this.destinationPath('fis-conf.js'), {
                        projectName: fileBase
                    }
                );
            } else {
                var fisConfFile = program(this.readFileAsString(this.destinationPath('fis-conf.js')));
                var fisConfContent = fisConfFile.callExpression('fis.config.merge');
                //添加文件合并规则
                fisConfContent.arguments.at(0).key('pack').key('\'static/' + fileBase + '/app_all.js\'').value('[/static\\/' + fileBase + '\\/.*\.js$/]');
                fisConfContent.arguments.at(0).key('pack').key('\'static/' + fileBase + '/app_all.css\'').value('[/static\\/' + fileBase + '\\/.*\.css$/]');
                this.fs.write(this.destinationPath('fis-conf.js'), fisConfFile.toString());
            }
            //end

            //这里分三条路，MIS路线，平台化MIS和业务线
            if (this.mis.projectType !== '业务线') {
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
                if (this.mis.projectType === 'MIS') {
                    //MIS路线
                    this.fs.copyTpl(
                        this.templatePath('template/_template.php'),
                        this.destinationPath('template/' + fileBase + '/index.php'), {
                            date: this.mis.date,
                            author: this.mis.author,
                            projectName: this._.humanize(this.mis.projectName),
                            projectFoler: fileBase,
                            modName: this.mis.modName,
                            uiPlugins: this.mis.uiPlugins,
                            theme: this.mis.theme
                        }
                    );

                    //template/index.css
                    this.fs.copy(
                        this.templatePath('static/project/views/' + this.mis.theme + '/theme.css'),
                        this.destinationPath('template/' + fileBase + '/index.css')
                    );

                } else {
                    //平台化
                    this.fs.copyTpl(
                        this.templatePath('template/_template_pplatform.php'),
                        this.destinationPath('template/' + fileBase + '/index.php'), {
                            date: this.mis.date,
                            author: this.mis.author,
                            projectName: this._.humanize(this.mis.projectName),
                            projectFoler: fileBase,
                            modName: this.mis.modName,
                            uiPlugins: this.mis.uiPlugins,
                            theme: this.mis.theme
                        }
                    );

                    //template/index.css
                    this.fs.copy(
                        this.templatePath('static/project/views/pplatform/theme.css'),
                        this.destinationPath('template/' + fileBase + '/index.css')
                    );


                    // 平台化需要resetcss
                    this.fs.copy(
                        this.templatePath('static/lib/resetcss.css'),
                        this.destinationPath('static/lib/resetcss.css')
                    );

                }

                //template/index.js
                this.fs.copyTpl(
                    this.templatePath('template/_template.js'),
                    this.destinationPath('template/' + fileBase + '/index.js'), {
                        date: this.mis.date,
                        author: this.mis.author,
                        uiPlugins: this.mis.uiPlugins,
                    }
                );

                //angular app.js
                this.fs.copyTpl(
                    this.templatePath('static/project/_app.js'),
                    this.destinationPath('static/' + fileBase + '/app.js'), {
                        date: this.mis.date,
                        author: this.mis.author,
                        moduleName: this._.camelize(this.mis.projectName),
                        modName: this.mis.modName,
                        uiPlugins: this.mis.uiPlugins
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

                //filter file
                this.fs.copyTpl(
                    this.templatePath('static/project/filters/_filter.js'),
                    this.destinationPath('static/' + fileBase + '/filters/filter.js'), {
                        date: this.mis.date,
                        author: this.mis.author,
                        resourceName: this._.classify(this.mis.projectName),
                        projectName: this._.camelize(this.mis.projectName)
                    }
                );

                //navbar directive
                this.fs.copyTpl(
                    this.templatePath('static/project/directives/navbar/_navbar.html'),
                    this.destinationPath('static/' + fileBase + '/directives/navbar/navbar.html'), {
                        theme: this.mis.theme,
                        projectName: this._.camelize(this.mis.projectName)
                    }
                );

                //如果是平台化MIS，则复制sidebar
                if (this.mis.projectType === '平台化MIS') {
                    this.fs.copy(
                        this.templatePath('static/project/directives/sidebar/_sidebar.html'),
                        this.destinationPath('static/' + fileBase + '/directives/sidebar/sidebar.html')
                    );
                    this.fs.copyTpl(
                        this.templatePath('static/project/directives/sidebar/_sidebar.js'),
                        this.destinationPath('static/' + fileBase + '/directives/sidebar/sidebar.js'), {
                            date: this.mis.date,
                            author: this.mis.author,
                            projectName: this._.camelize(this.mis.projectName)
                        }
                    );
                    this.fs.copyTpl(
                        this.templatePath('static/project/directives/sidebar/_sidebar.css'),
                        this.destinationPath('static/' + fileBase + '/directives/sidebar/sidebar.css'), {
                            date: this.mis.date,
                            author: this.mis.author,
                            projectName: this._.camelize(this.mis.projectName)
                        }
                    );

                }

                this.fs.copyTpl(
                    this.templatePath('static/project/directives/navbar/_navbar.js'),
                    this.destinationPath('static/' + fileBase + '/directives/navbar/navbar.js'), {
                        projectName: this._.camelize(this.mis.projectName)
                    }
                );

                // sample views
                for (var i = 2; i >= 1; i--) {

                    //view template
                    this.fs.copyTpl(
                        this.templatePath('static/project/views/' + (this.mis.projectType === 'MIS'?this.mis.theme:'pplatform') + '/view.html'),
                        this.destinationPath('static/' + fileBase + '/views/view' + i + '/view' + i + '.html'), {
                            viewName: 'view' + i
                        }
                    );

                    //view controller
                    this.fs.copyTpl(
                        this.templatePath('static/project/views/view.js'),
                        this.destinationPath('static/' + fileBase + '/views/view' + i + '/view' + i + '_controller.js'), {
                            date: this.mis.date,
                            author: this.mis.author,
                            resourceName: this._.classify(this.mis.projectName),
                            projectName: this._.camelize(this.mis.projectName),
                            index: i,
                            controllerName: 'View' + i + 'Ctrl',
                            theme: this.mis.theme
                        }
                    );

                    //view style
                    this.fs.copyTpl(
                        this.templatePath('static/project/views/view.css'),
                        this.destinationPath('static/' + fileBase + '/views/view' + i + '/view' + i + '.css'), {
                            date: this.mis.date,
                            author: this.mis.author
                        }
                    );
                }
            } else {
                //业务线模板
                //control
                this.fs.copyTpl(
                    this.templatePath('control/_control_business.php'),
                    this.destinationPath('control/' + fileBase + '.php'), {
                        date: this.mis.date,
                        author: this.mis.author,
                        projectName: fileBase,
                    }
                );

                this.fs.copyTpl(
                    this.templatePath('template/_template_business.php'),
                    this.destinationPath('template/' + fileBase + '/' + fileBase + '.php'), {
                        date: this.mis.date,
                        author: this.mis.author,
                        templateDescription: this.mis.modDescription
                    }
                );
                //template js
                this.fs.copyTpl(
                    this.templatePath('template/_template.js'),
                    this.destinationPath('template/' + fileBase + '/' + fileBase + '.js'), {
                        date: this.mis.date,
                        author: this.mis.author
                    }
                );

                //template css
                this.fs.copyTpl(
                    this.templatePath('template/_template.css'),
                    this.destinationPath('template/' + fileBase + '/' + fileBase + '.css'), {
                        date: this.mis.date,
                        author: this.mis.author
                    }
                );

                //static directory
                this.mkdir('static');

            }

            //static/img
            this.fs.copy(
                this.templatePath('static/img/tb-logo.png'),
                this.destinationPath('static/img/tb-logo.png')
            );

        }
    },

    install: function() {
        this.installDependencies({
            // skipInstall: !this.mis.uiPlugins.length, //项目为MIS并且选择了插件才进行安装
            skipInstall: false, //项目为MIS并且选择了插件才进行安装
            callback: function() {

                //如果选择了插件才进行复制
                if ( !! this.mis.uiPlugins.length) {
                    this.log('将bower安装的插件复制到static/lib目录下...');
                    var gruntTask = this.spawnCommand('grunt', ['copy']);

                    //when finish copying, say goodbye
                    gruntTask.on('close', function(code) {
                        //if exited abnormally the code is null
                        if (code === null) {
                            this.log('error while copying file to static folder :(');
                        } else {
                            this.log('文件复制完成！');
                            this.log(this.mis.goodbyeMsg);
                        }
                    }.bind(this));
                } else {
                    this.log('没有需要复制的文件');
                    this.log(this.mis.goodbyeMsg);
                }

            }.bind(this)
        });
    },
    end: function() {

        //store user configuration
        this.config.set('author', this.mis.author);
        this.config.set('projectName', this.mis.projectName);

        //一些善后工作，ignore bower_components folder, 删除带中文的文件避免编译失败
        //在ocean机器上会执行失败，先去掉
        // this.spawnCommand('rm bower_components/ztree_v3/QUI 框架介绍.txt');
    }
});