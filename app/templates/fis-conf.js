/**
 * @desc FIS2.0编译脚本配置
 * @date 2013-12-18
 */


//设置编码信息 ，默认是utf-8，PC使用gbk，无线使用utf-8
fis.config.set('project.charset', 'utf-8');

//设置编译文件的配置信息
fis.config.set('tbFisConfig', {
	//设置哪些个地方用了新框架的内容
	newFrameReg : /\/widget\/.*\.php$/i,
	//设置静态资源发布的短路径,PC的是'/tb/_/',无线的请改为'/tb/mobile'
	shortPath : '/tb/_/',
	//设置静态文件前缀,PC的是'static-',无线的是'mobile/'
	staticPrefix : 'static-'
});
 

//配置要合并的代码，即之前的__merge_conf.php配置的内容
fis.config.merge({
	pack : {
		'static/<%= projectName %>/app_all.js' :[
			/static\/<%= projectName %>\/.*.js/
		]
	}
});

require('./_build/fis2/fis-conf-base.js');
