echo off
if exist "%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319" goto netOld
:DispError
echo ���Ļ�����û�а�װ .net FrameWork 4.0
pause
goto LastEnd
:netOld
cd %SystemRoot%\Microsoft.NET\Framework64\v4.0.30319
echo ���Ļ����ϰ�װ����Ӧ��.net FrameWork,���԰�װ�����񣬰������������������
echo off
pause
%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319\installutil D:\ShenCai\SolidWasteSyn\Project.WindowService.exe
net start "TaskPlanExecSync"
:LastEnd
rem exit