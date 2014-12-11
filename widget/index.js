'use strict';
var yeoman = require('yeoman-generator');
var astQuery = require("ast-query");

function inArraySimple(array, el) {
    var isExist = array.some(function(v) {
        return v === el;
    });
    return isExist;
}
module.exports = yeoman.generators.Base.extend({
    initializing: function() {

        this.argument('name', {
            required: true,
            type: String,
            desc: 'widget name'
        });
        this.widgetTypes = ['pc', '无线'];
        this.widgetExistNames = [];
        var widgetExists = this.expand(this.destinationPath('widget/*'));
        widgetExists.forEach(function(v, i, a) {
            this.widgetExistNames.push(this._.chain(v).strRightBack('/').underscored().value());
        }.bind(this));
    },
    prompting: function() {
        var done = this.async();
        var prompts;
        if (inArraySimple(this.widgetExistNames, this.name)) {
            prompts = [{
                type: 'input',
                name: 'widgetName',
                message: '咳咳，这个widget已经存在啦，换一个名字吧~~',
                store: false,
                validate: function(input) {
                    if (!input || inArraySimple(this.widgetExistNames, input)) {
                        this.log('ddd');
                        return false;
                    } else {
                        this.name = input;
                        return true;
                    }
                }.bind(this)
            }, {
                type: 'list',
                name: 'widgetType',
                choices: this.widgetTypes,
                message: '那么问题来了，你要新建那种类型的widget呢？',
                store: true
            }];
        } else {
            prompts = [{
                type: 'list',
                name: 'widgetType',
                choices: this.widgetTypes,
                message: '将新建那种类型的widget？',
                store: true
            }];
        }
        this.prompt(prompts, function(anwsers) {
            this.name = anwsers.widgetName || this.name;
            this.widgetType = anwsers.widgetType || 'pc';
            done();
        }.bind(this));
    },
    writing: function() {
        var fileBase = this._.underscored(this.name);
        var author = process.env.USER || 'author';
        var date = ((new Date()).getFullYear()) + '-' + ((new Date()).getMonth() + 1) + '-' + ((new Date()).getDate());
        var deployConfFile = this.expand(this.destinationPath('deploy-conf.js'));
        var modName = '';
        if (deployConfFile.length > 0) {
            var deployConfTree = astQuery(this.readFileAsString(this.destinationPath('deploy-conf.js')));
            var deployConfBody = deployConfTree.assignment('module.exports').nodes[0].right.properties;
            modName = deployConfBody[1].value.value;
        }
        if (this.widgetType === 'pc') {
            this.log('yo yo 切克闹，马上就要生成一个崭新的pc widget了，秋豆麻袋~~');
            //copy the widget php class file
            this.fs.copyTpl(
                this.templatePath('pc_widget.class.php'),
                this.destinationPath('widget/' + fileBase + '/' + fileBase + '.class.php'), {
                    name: this._.classify(this.name),
                    author: author,
                    date: date
                }
            );

            //copy the widget php file
            this.fs.copyTpl(
                this.templatePath('pc_widget.php'),
                this.destinationPath('widget/' + fileBase + '/' + fileBase + '.php'), {
                    name: this.name,
                    author: author,
                    date: date,
                    modName: modName
                }
            );

            //copy the widget js file
            this.fs.copyTpl(
                this.templatePath('pc_widget.js'),
                this.destinationPath('widget/' + fileBase + '/' + fileBase + '.js'), {
                    name: this.name,
                    author: author,
                    date: date,
                    modName: modName
                }
            );

            //copy the widget css file
            this.fs.copyTpl(
                this.templatePath('pc_widget.css'),
                this.destinationPath('widget/' + fileBase + '/' + fileBase + '.css'), {
                    className: this.name,
                    author: author,
                    date: date
                }
            );
        } else if (this.widgetType === '无线') {
            this.log('yo yo 切克闹，马上就要生成一个崭新的无线 widget了，秋豆麻袋~~');
            //copy the widget php class file
            this.fs.copyTpl(
                this.templatePath('mo_widget.class.php'),
                this.destinationPath('widget/' + fileBase + '/' + fileBase + '.class.php'), {
                    name: this._.classify(this.name),
                    author: author,
                    date: date
                }
            );

            //copy the widget php file
            this.fs.copyTpl(
                this.templatePath('mo_widget.php'),
                this.destinationPath('widget/' + fileBase + '/' + fileBase + '.php'), {
                    author: author,
                    date: date,
                    name: this.name,
                    className: this._.classify(this.name),
                    modName: modName,
                    instanceName: this._.camelize(this.name)
                }
            );

            //copy the widget js file
            this.fs.copyTpl(
                this.templatePath('mo_widget.js'),
                this.destinationPath('widget/' + fileBase + '/' + fileBase + '.js'), {
                    author: author,
                    date: date,
                    name: this.name,
                    className: this._.classify(this.name),
                    modName: modName
                }
            );

            //copy the widget css file
            this.fs.copyTpl(
                this.templatePath('mo_widget.css'),
                this.destinationPath('widget/' + fileBase + '/' + fileBase + '.css'), {
                    className: this.name,
                    author: author,
                    date: date
                }
            );
        }
    }
});