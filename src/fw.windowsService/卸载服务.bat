echo off
if exist "%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319" goto netOld
:DispError
echo ���Ļ�����û�а�װ.net FrameWork 4.0,��װ������ֹ
pause
goto LastEnd
:netOld
echo ����ж�ر����񣬰������������������
echo off
pause
net stop "TaskPlanExecSync"
cd %SystemRoot%\Microsoft.NET\Framework64\v4.0.30319
%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319\installutil /uninstall  D:\ShenCai\SolidWasteSyn\Project.WindowService.exe
:LastEnd
rem exit