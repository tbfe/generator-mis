'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
    initializing: function() {

        this.argument('name', {
            required: true,
            type: String,
            desc: 'view name'
        });

        //获取所有已经存在的项目供用户选择将view 添加到哪个项目
        this.existedProjects = [];
        var controlFiles = this.expand(this.destinationPath('control/*.php'));

        controlFiles.forEach(function(v) {
            this.existedProjects.push(this._.chain(v).strRightBack('/').strLeftBack('.php').underscored().value());
        }.bind(this));
    },
    prompting: function() {
        var done = this.async();
        var prompts = [{
            type: 'checkbox',
            name: 'projectName',
            choices: this.existedProjects,
            message: '将新建的view添加到哪个项目？',
            store: true
        }];

        this.prompt(prompts, function(anwsers) {
            this.projectName = anwsers.projectName;
            done();
        }.bind(this));
    },
    writing: function() {
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
                name: fileBase, //view name
                resourceName: this._.classify(this.projectName),
                projectName: this._.camelize(this.projectName)
            }
        );

        //update app.js
        //更新appjs成本较大，先不做
        console.log('projectname:' + this.projectName);
    }
});