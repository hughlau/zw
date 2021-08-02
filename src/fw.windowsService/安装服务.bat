echo off
if exist "%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319" goto netOld
:DispError
echo 您的机器上没有安装 .net FrameWork 4.0
pause
goto LastEnd
:netOld
cd %SystemRoot%\Microsoft.NET\Framework64\v4.0.30319
echo 您的机器上安装了相应的.net FrameWork,可以安装本服务，按任意键继续…………
echo off
pause
%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319\installutil D:\ShenCai\SolidWasteSyn\Project.WindowService.exe
net start "TaskPlanExecSync"
:LastEnd
rem exit