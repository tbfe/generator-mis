注意：
1. __ 形式的命名仅用做框架使用，正常代码请不要这样命名；
2. widget service component temlpate layout 的结构都是一样的，可参考 template/__guide
3. 请尽量使用公共模块的 layout，如无特殊需要，请不要另行创建

使用说明：
1. common 模块，请将 __resource_map_conf.php.conf 重命名为 __resource_map_conf.php 并根据需要修改其中的内容；
2. 需要配置compile.conf，如果是子模块使用for_submod那个文件；
3. 父模块，请将 __mod_conf.php.conf 重命名为 __mod_conf.php，并在其中完成子模块列表的配置；
4. 子模块，请删除 __init.php

各文件夹功能介绍
1. /conf    配置文件目录，其中 static_loader.ini、module.ini、stamp.ini，已经废弃，仅 white_list.txt仍然有效。
2. /control 需要在control中添加以下这行代码，放在所有的assign的后面，display之前。否则无法使用getPageData方法
            /** 贴吧实验室配置数据初始化结束 */
            PhizView::page('pb:page/Index.class.php')->assign($this->_arrVars)->fetch();
            /*!!!!!!!!!!!!!!!!!该行以后不要再assign数据!!!!!!!!!!!!!!!!!!!!*/
3. /data    该目录属于bingo2框架使用，功能是：存储bingo-view在运行过程中所缓存的配置文件。
            暂不需要给其中放任何文件。
            在需要时，一些由框架、外部系统（mis发布平台）、模块自定义的数据可以存放在其中。
4. /layout  请尽量使用公共模块的 layout，如无特殊需要，请不要另行创建。
5. /widget  每个widget存放一个目录，包含所需的js、css、模板文件；
            核心的 js、css、php 文件 要求和 widget 名相同；
            框架会自动识别同名的js css 完成加载
            结构和 template 的结构相同，可参见 template/__guide
            暂不支持子目录
