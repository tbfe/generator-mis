'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
    initializing: function() {

        this.argument('name', {
            required: false,
            type: String,
            desc: 'view name'
        });

        //获取所有已经存在的项目供用户选择将view 添加到哪个项目
        this.existedProjects = [];
        var controlFiles = this.expand(this.destinationPath('control/*.php'));

        controlFiles.forEach(function(v) {
            this.existedProjects.push(this._.chain(v).strRightBack('/').strLeftBack('.php').underscored().value());
        }.bind(this));

        //获取所有项目下存在的view，后面view 重名检测使用
        if (this.existedProjects.length > 0) {
            this.existedViews = {};
            this.existedProjects.forEach(function(v) {
                this.existedViews[v] = [];
                var views = this.expand(this.destinationPath('static/' + this._.underscored(v) + '/views/*/*.html'));
                views.forEach(function(v2) {
                    this.existedViews[v].push(this._.chain(v2).strRightBack('/').strLeftBack('.html').underscored().value());
                }.bind(this));
            }.bind(this));
        }
    },
    prompting: function() {
        //processing only if there exist projects
        if (this.existedProjects.length > 0) {
            var done = this.async();
            var prompts = [{
                type: 'input',
                name: 'author',
                message: '作者（用于生成文件头部的文档）:',
                default: this.user.git.name() || process.env.USER || '',
                store: true
            }, {
                type: 'list',
                name: 'projectName',
                choices: this.existedProjects,
                message: '将新建的view添加到哪个项目？',
                store: true,
                validate: function(input) {
                    if ( !! input) {
                        return '至少选择一个吧...';
                    } else {
                        return true;
                    }
                }.bind(this)
            }];

            this.prompt(prompts, function(anwsers) {
                this.projectName = anwsers.projectName;
                this.date = new Date().toISOString().substring(0, 10);
                this.author = anwsers.author || '';
                
                //secondary prompt, now we got the selected name
                this.prompt({
                    type: 'input',
                    name: 'viewName',
                    message: '新建view的名称',
                    default: this.name || '',
                    validate: function(input) {
                        //检查所选项目下是否存在同名view，如果存在则无法创建，重新输入view名字
                        if (input === '' || input === undefined) {
                            return '非法的view名';
                        } else if (this.existedViews[this.projectName].indexOf(this._.underscored(input)) > -1) {
                            return input + ' 已经存在于项目 ' + this.projectName + ' 下了:(';
                        } else {
                            return true;
                        }
                    }.bind(this)
                }, function(anwsers) {
                    this.name = anwsers.viewName;
                    done();
                }.bind(this));

            }.bind(this));

        }

    },
    writing: function() {
        if (this.existedProjects.length > 0) {
            var projectFolder = this._.underscored(this.projectName);
            var fileBase = this._.underscored(this.name);
            //copy the view template
            this.fs.copyTpl(
                this.templatePath('view.html'),
                this.destinationPath('static/' + projectFolder + '/views/' + fileBase + '/' + fileBase + '.html'), {
                    name: this.name
                }
            );
            //copy the view controller
            this.fs.copyTpl(
                this.templatePath('view.js'),
                this.destinationPath('static/' + projectFolder + '/views/' + fileBase + '/' + fileBase + '_controller.js'), {
                    author: this.author,
                    date: this.date,
                    name: fileBase, //view name
                    resourceName: this._.classify(this.projectName),
                    projectName: this._.camelize(this.projectName)
                }
            );

            //copy the view style
            this.fs.copyTpl(
                this.templatePath('view.css'),
                this.destinationPath('static/' + projectFolder + '/views/' + fileBase + '/' + fileBase + '.css'), {
                    author: this.author,
                    date: this.date,
                    name: fileBase, //view name
                    projectName: this._.camelize(this.projectName)
                }
            );
        }
    },
    end: function() {
        //say goodbye
        if (this.existedProjects.length > 0) {
            this.log(chalk.green('All done!\n') + chalk.white('You are ready to go') + '\n' + chalk.yellow('HAPPY CODING \\(^____^)/'));
        } else {
            this.log(chalk.red('似乎没有找到可以添加view的项目~ '));
            this.log('先 ' + chalk.yellow('yo mis') + ' 一下创建项目吧~');
        }
    }
});