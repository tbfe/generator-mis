#!/bin/bash
export PATH=$BUILD_KIT_PATH/git/git-2.0.0/bin:$PATH

if [ -d "_build" ]; then
    if [ "$1" = "stable" ]||[ "$1" = "develop" ]||[ "$1" = "master" ];then
        (cd _build && git checkout "$1" )
    else
        (cd _build && git pull)
    fi
else

    if [ "$1" = "stable" ]||[ "$1" = "develop" ]||[ "$1" = "master" ];then
        git clone -b "$1" http://gitlab.baidu.com/tbfe/build.git _build
    else
        git clone http://gitlab.baidu.com/tbfe/build.git _build
    fi
fi

if [ $# != 1 ] || [ "$1" != '--skip' ];then
    (cd _build && sh build_fis.sh "$1")
fi