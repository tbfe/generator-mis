'use strict';
var yeoman = require('yeoman-generator');
var astQuery = require('ast-query');

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
    widgetExists.forEach(function(v) {
      this.widgetExistNames.push(this._.chain(v).strRightBack('/').underscored().value());
    }.bind(this));
  },
  prompting: function() {
    var done = this.async();
    var prompts = [];
    this.author = process.env.USER;

    if (! this.author) {
      prompts.push({
        type: 'input',
        name: 'author',
        message: '雁过留声，人过留名~~',
        store: true,
        validate: function(input) {
          if (!input){
            return false;
          }
          return true;
        }
      });
    }
    if (this.widgetExistNames.indexOf(this.name) >= 0) {
      prompts.push({
        type: 'input',
        name: 'widgetName',
        message: '咳咳，这个widget已经存在啦，换一个名字吧~~',
        store: false,
        validate: function(input) {
          if (!input || this.widgetExistNames.indexOf(input) >= 0) {
            return false;
          }
          return true;
        }.bind(this)
      });
    }
    prompts.push({
      type: 'list',
      name: 'widgetType',
      choices: this.widgetTypes,
      message: '那么问题来了，你要新建哪种类型的widget呢？',
      store: true
    });

    //support less
    prompts.push({
      type: 'confirm',
      name: 'enableLess',
      message: '想启用LESS么？',
      default: false,
      store: true
    });

    this.prompt(prompts, function(anwsers) {
      this.name = anwsers.widgetName || this.name;
      this.widgetType = anwsers.widgetType || 'pc';
      this.author = anwsers.author || this.author;
      this.enableLess = anwsers.enableLess;
      done();
    }.bind(this));
  },
  writing: function() {
    var fileBase = this._.underscored(this.name);
    var date = ((new Date()).getFullYear()) + '-' + ((new Date()).getMonth() + 1) + '-' + ((new Date()).getDate());
    var deployConfFile = this.expand(this.destinationPath('deploy-conf.js'));
    var modName = '';
    if (deployConfFile.length > 0) {
      var deployConfTree = astQuery(this.readFileAsString(this.destinationPath('deploy-conf.js')));
      var deployConfBody = deployConfTree.assignment('module.exports').nodes[0].right.properties;
      modName = deployConfBody[1].value.value;
    }
    var defaultParams = {
      name: this.name,
      author: this.author,
      date: date,
      modName: modName,
      className: this._.classify(this.name),
      instanceName: this._.camelize(this.name)
    };
    //copy the widget php class file
    this.fs.copyTpl(
      this.templatePath('widget.class.php'),
      this.destinationPath('widget/' + fileBase + '/' + fileBase + '.class.php'), defaultParams
    );

    //copy the widget css file
    this.fs.copyTpl(
      this.templatePath('widget.'+(this.enableLess?'less':'css')),
      this.destinationPath('widget/' + fileBase + '/' + fileBase + (this.enableLess?'.less':'.css')), defaultParams
    );

    if (this.widgetType === 'pc') {
      this.log('yo yo 切克闹，马上就要生成一个崭新的pc widget了，秋豆麻袋~~');

      //copy the widget php file
      this.fs.copyTpl(
        this.templatePath('pc_widget.php'),
        this.destinationPath('widget/' + fileBase + '/' + fileBase + '.php'), defaultParams
      );

      //copy the widget js file
      this.fs.copyTpl(
        this.templatePath('pc_widget.js'),
        this.destinationPath('widget/' + fileBase + '/' + fileBase + '.js'), defaultParams
      );
    } else if (this.widgetType === '无线') {
      this.log('yo yo 切克闹，马上就要生成一个崭新的无线 widget了，秋豆麻袋~~');

      //copy the widget php file
      this.fs.copyTpl(
        this.templatePath('mo_widget.php'),
        this.destinationPath('widget/' + fileBase + '/' + fileBase + '.php'), defaultParams
      );

      //copy the widget js file
      this.fs.copyTpl(
        this.templatePath('mo_widget.js'),
        this.destinationPath('widget/' + fileBase + '/' + fileBase + '.js'), defaultParams
      );
    }
  }
});
