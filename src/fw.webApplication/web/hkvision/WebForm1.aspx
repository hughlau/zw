<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="fw.webApplication.web.hkvision.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>网络摄像头监控界面</title>
</head>
<body>
    <form id="form1" runat="server">
    <div style="height: 504px;width:80%">
    <table >
    <tr>
    <td>设备IP:</td><td >
        <input id="Text2" type="text" /></td>
     <td>设备端口号:</td><td >
        <input id="Text1" type="text" /></td>
   
    <td>用户名:</td><td >
           <input id="Text3" type="text" /></td>
     <td>密码:</td><td >
           <input id="Text4" type="text" /></td>
    <td>
        <input id="Submit1" type="submit" value="登录" /></td></tr>
    </table>
      
    
    </div>
    </form>
</body>
</html>
