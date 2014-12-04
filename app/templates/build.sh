#!/bin/bash
export PATH=$BUILD_KIT_PATH/git/git-2.0.0/bin:$PATH
if [ -d "_build" ]; then
	(cd _build && git pull)
else
	git clone http://gitlab.baidu.com/tbfe/build.git _build
fi

if [ $# != 1 ] || [ $1 != '--skip' ];then
	(cd _build && sh build_fis.sh $1)
fi
