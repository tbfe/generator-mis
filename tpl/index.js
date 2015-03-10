'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
    initializing: function() {

        this.argument('name', {
            required: false,
            type: String,
            desc: 'template name'
        });

        this.existedTemplates = [];

        //获取所有项目下存在的template，后面template 重名检测使用
        var tempates = this.expand(this.destinationPath('template/*/*.php'));
        tempates.forEach(function(v) {
            this.existedTemplates.push(this._.chain(v).strRightBack('/').strLeftBack('.php').underscored().value());
        }.bind(this));

    },
    prompting: function() {
        //processing only if there exist projects
        var done = this.async();
        var prompts = [{
            type: 'input',
            name: 'author',
            message: '作者（用于生成文件头部的文档）:',
            default: this.user.git.name() || process.env.USER || '',
            store: true
        }, {
            type: 'input',
            name: 'templateName',
            message: '新建template的名称',
            default: this.name || '',
            validate: function(input) {
                //检查所选项目下是否存在同名view，如果存在则无法创建，重新输入view名字
                if (input === '' || input === undefined) {
                    return '非法的template名';
                } else if (this.existedTemplates.indexOf(this._.underscored(input)) > -1) {
                    return input + ' 已经存:(';
                } else {
                    return true;
                }
            }.bind(this)
        }, {
            type: 'input',
            name: 'templateDescription',
            message: '描述:',
            default: ''
        }];

        this.prompt(prompts, function(anwsers) {
            this.date = new Date().toISOString().substring(0, 10);
            this.author = anwsers.author || '';
            this.templateName = anwsers.templateName;
            this.templateDescription = anwsers.templateDescription;
            done();
        }.bind(this));

    },
    writing: function() {

        var fileBase = this._.underscored(this.templateName);

        //control
        this.fs.copyTpl(
            this.templatePath('_control.php'),
            this.destinationPath('control/' + fileBase + '.php'), {
                templateName: this.templateName,
                date: this.date,
                author: this.author
            }
        );
        //template
        this.fs.copyTpl(
            this.templatePath('_template.php'),
            this.destinationPath('template/' + fileBase + '/' + fileBase + '.php'), {
                date: this.date,
                author: this.author,
                templateDescription: this.templateDescription
            }
        );
        //template js
        this.fs.copyTpl(
            this.templatePath('_template.js'),
            this.destinationPath('template/' + fileBase + '/' + fileBase + '.js'), {
                date: this.date,
                author: this.author
            }
        );

        //template css
        this.fs.copyTpl(
            this.templatePath('_template.css'),
            this.destinationPath('template/' + fileBase + '/' + fileBase + '.css'), {
                date: this.date,
                author: this.author
            }
        );
    },
    end: function() {
        //say goodbye
        this.log(chalk.green('All done!\n') + chalk.white('You are ready to go') + '\n' + chalk.yellow('HAPPY CODING \\(^____^)/'));
    }
});