%~dp0InstallUtil.exe %~dp0fw.mqttService.exe
Net Start JJWSMqtt
sc config JJWSMqtt start= auto
pause