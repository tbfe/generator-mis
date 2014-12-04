@ echo off
goto start
	=@author yaodongwei
	=@since 2014-6-18
:start

echo %0

::delete output
if exist output (rd /s /q output)

::update/fetch _build
if exist _build (cd _build && git pull && cd ..) else (git clone http://gitlab.baidu.com/tbfe/build.git _build)

cd _build

start deploy.bat %1

exit
