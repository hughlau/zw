<%@ Page Language="C#" AutoEventWireup="true" CodeFile="jiaban.aspx.cs" Inherits="users_user" %>

<!DOCTYPE html/>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>用户管理</title>
    <script src="../../scripts/boot.js" type="text/javascript"></script>
    
 <%--<script src="../scripts/jquery-1.6.2.min.js" type="text/javascript"></script>--%>
    <!--MiniUI-->
<%--    <link href="../themes/default/miniui.css" rel="stylesheet" type="text/css" />        
    <script src="../scripts/miniui/miniui.js" type="text/javascript"></script>
    <script src="../scripts/boot.js" type="text/javascript"></script> --%>
    
    <!--引入皮肤样式-->
    <%--<link href="../scripts/miniui/themes/blue/skin.css" rel="stylesheet" type="text/css" />--%>
</head>
<body>
     <form id="form1" runat="server">
     <h1>业余时间来院加班人员登记表&nbsp; 
         <asp:TextBox ID="TextBoxUser" runat="server" Width="0px" BorderStyle="None" 
             Enabled="False" EnableViewState="False" Height="0px"></asp:TextBox>
         <asp:TextBox ID="TextBoxYuanqu" runat="server" Width="0px" BorderStyle="None" 
             Enabled="False" Height="0px" style="font-size: medium; color: #FF3300"></asp:TextBox>
     </h1>

    <div style="width:1150px;">
        <div class="mini-toolbar" style="border-bottom:0;padding:0px;">
            <table style="width:1150px;">
                <tr>
                    <td style="width:100%;">
                        <a class="mini-button" iconCls="icon-addnew" onclick="addRow()" plain="true">增加</a>
                        <span class="separator"></span>
                        <a class="mini-button" iconCls="icon-add" onclick="CloneRow()" plain="true">复制新增</a>
                        
                         <span class="separator"></span>
                        <a class="mini-button" iconCls="icon-remove" onclick="removeRow()" plain="true">删除</a>
                        <span class="separator"></span>
                        <a class="mini-button" iconCls="icon-save" onclick="saveData()" plain="true">保存</a>   
                         <span class="separator"></span>         
                    </td>
                    <td style="white-space:nowrap;">
                        <input id="staff_name" class="mini-textbox" emptyText="请输入加班人员姓名" style="width:150px;" onenter="onKeyEnter" />   
                        <a class="mini-button" onclick="search()">查询</a>
                    </td>
                </tr>
            </table>           
        </div>
    </div>
    <div id="datagrid1" class="mini-datagrid" style="width:1150px;height:280px;" 
        url="StaffService.aspx?method=GetStaffByUser" idfileld="id" allowResize="false" pageSize="20" 
        allowCellEdit="true" allowCellSelect="true" multiSelect="false"  allowRowSelect="true"
        oncellcommitedit="OnCellCommitEdit" OnCellBeginEdit="OnCellBeginEdit" fitcolumns="false"
           
    >

        <div property="columns"> 
            <div type="indexcolumn" width="30"></div>      
            <div field="staff_id" vtype="required;int"  name = "staff_id" allowResize="false" width="80" headerAlign="center" allowSort="false">工号
                <input property="editor"  class="mini-ButtonEdit"  onbuttonclick="onButtonEdit" selectOnFocus="true"  style="width:100%;" />
            </div>
            <div field="staff_name" vtype="required" name="staff_name" align="center" allowResize="false" width="50" headerAlign="center" allowSort="false">姓名
                <input property="editor" class="mini-textbox"  />
            </div>
             <div field="dept" name="dept" vtype="required" allowResize="false" width="120" headerAlign="center" allowSort="true">科室
                <input property="editor" class="mini-textbox"  />
            </div>
              <div field="kind" name="kind"  width="50" align="center" headerAlign="center" >身份
                <input property="editor" class="mini-combobox" style="width:100%;" data="Genderskind"" />                
            </div> 
             <div field="oper_nurse" type="checkboxcolumn" turevalue="1" falsevalue="0" allowResize="false" width="60" headerAlign="center" allowSort="false">手术护士
              
            </div>

            <div  field="grade" vtype="required" name="grade"   width="50" align="center" headerAlign="center" >职称
                <input property="editor" class="mini-combobox"  data="Genders"" />                
            </div> 

              <div field="start_time" vtype="required" allowResize="false" width="140" dateFormat="yyyy-MM-dd HH:mm" headerAlign="center" allowSort="false">开始时间
                <input property="editor"  class="mini-datepicker" showtime="true" showTodayButton="false" showOkButton="true" showClearButton="false" format="yyyy-MM-dd HH:mm"  />
            </div>
             <div field="end_time" vtype="required" allowResize="false" width="140" dateFormat="yyyy-MM-dd HH:mm" headerAlign="center" allowSort="false">结束时间
                <input property="editor"  class="mini-datepicker" showtime="true" showTodayButton="false" showOkButton="true" showClearButton="false" format="yyyy-MM-dd HH:mm"  />
            </div>
            <div field="patient_id" name="patient_id" vtype="required;int" allowResize="false" width="60" headerAlign="center" allowSort="false">住院号
                <input property="editor"  class="mini-textbox"  />
            </div>
            <div field="pat_name" vtype="required" name="pat_name" allowResize="false" width="50" headerAlign="center" allowSort="false">病人
                <input property="editor" class="mini-textbox"  />
            </div>
            <div field="diagnosis" vtype="required" name="diagnosis" allowResize="false" width="100" headerAlign="center" allowSort="false">诊断
                <input property="editor" class="mini-textbox"  />
            </div>
            <div field="taxi" type="checkboxcolumn" turevalue="1" falsevalue="0" allowResize="false" width="50" headerAlign="center" allowSort="false">出租
              
            </div>
            <div field="create_user" vtype="required"  allowResize="false" width="50" align="center"  headerAlign="center" allowSort="false">值班
                <input property="editor" class="mini-textbox" />
            </div>
               <div field="create_time" vtype="required" allowResize="false" width="110" dateFormat="yyyy-MM-dd HH:mm" headerAlign="center" allowSort="true">记录时间
                <input property="editor" class="mini-datepicker"  showtime="true"  format="yyyy-MM-dd HH:mm:ss"  />
            </div>
      
            <%-- <div  field="yuanqu" width="40" align="center" headerAlign="center" >院区
                <input property="editor" class="mini-combobox"  data="GendersYuanqu"" />                
            </div>--%> 
                   
        </div>
    </div>
       
    <script type="text/javascript">
     
        var Genders = [{ id: '高级', text: '高级' }, { id: '中级', text: '中级' }, { id: '初级', text: '初级'}];
        var GendersYuanqu = [{ id: '东院', text: '东院' }, { id: '西院', text: '西院'}];
        var GendersTaxi = [{ id: '是', text: '是' }, { id: '否', text: '否'}];
        var Genderskind = [{ id: '医疗', text: '医疗' }, { id: '护理', text: '护理' },  { id: '行管', text: '行管' }, { id: '其他', text: '其他'}];
        mini.parse();

        var txtUser = document.all.TextBoxUser.value;
        var txtYuanqu = document.all.TextBoxYuanqu.value;

        var grid = mini.get("datagrid1");
        grid.load({key:txtUser});

        var staff_grid = mini.get("datagrid2");
        var win = mini.get("selectWindow");
    
        //////////////////////////////////////////////////////
        function onShowPopup(e) {
            staff_grid.load();
        }

        function onSearchClick(e) {
           staff_grid.load({
                key: keyText.value
            });
        }

        function onButtonEdit(e) {
            var btnEdit = this;
            mini.open({
                url: bootPATH + "../jiaban/SelectID.html",

                title: "工号查询",
                width: 400,
                height: 250,
                ondestroy: function (action) {
                    if (action == "close") return false;
                    if (action == "ok") {
                        var iframe = this.getIFrameEl();
                        var data = iframe.contentWindow.GetData();
                        data = mini.clone(data);    //必须
                        if (data) {
                            btnEdit.setText(data.sysno);
                            btnEdit.setValue(data.sysno);

                            grid.setCurrentCell([0, 7]);
                            grid.beginEditCell();

                        }
                    }

                }
            });

        }

       function search() {
            var key = mini.get("key").getValue();

            grid.filter(function (row) {
                var name = String(row.staff_name).toLowerCase();
                if (name.indexOf(key) != -1) return true;
                return false;
            });
        }


      
        function OnCellBeginEdit(e) {
            var record = e.record, field = e.field;
            if (field == "create_time" || field == "yuanqu" || field == "create_user" || field=="staff_name") {
                e.cancel = true;    //不允许编辑保存、修改时间
            }

         
            if (field == "start_time") {

                 if (!e.value) {                 
                        var MyTime = new Date();
                        var now = mini.formatDate(MyTime, "yyyy-MM-dd HH:mm");
                        var s_time, e_time;
                        if (MyTime.getHours() >= 9) {  //中午之前是昨天的加班
                            s_time = mini.formatDate(MyTime, "yyyy-MM-dd 17:00");

                        } else {
                            var yestoday = GetDate(-1);
                            s_time = yestoday + " 17:00";

                        }
                        e.value = s_time;
                }

                }

            
        }
         
    

        function onKeyEnter(e) {
            search();
        }

        function addRow() {
            var newRow = { name: "New Row" };
            grid.addRow(newRow, 0);
            grid.setCurrentCell([0, 1]);
            grid.beginEditCell();
//            grid.updateRow(newRow, { staff_id: "" });

        }

        function CloneRow() {
            var row = grid.getSelected();
            if (row) {
                var newRow = mini.clone(row);

                grid.addRow(newRow, 0);
                delete newRow.id;

                grid.setCurrentCell([0, 1]);
                grid.beginEditCell();


            } else {
                mini.alert("请先选择一条记录作为模板！");
            }
        }

        function removeRow() {
            var rows = grid.getSelecteds();
            if (rows.length > 0) {
                grid.removeRows(rows, true);
            }
        }

        //日期函数
        function GetDate(AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1; //获取当前月份的日期
            var d = dd.getDate();
            return y + "-" + m + "-" + d; 

        }

              
        function OnCellCommitEdit(e) {
            var grid = e.sender;
            var record = e.record;
            var field = e.field, value = e.value;

            if (field == "staff_id") {
                $.ajax({
                    url: "StaffService.aspx?method=GetStaffInfo",
                    data: { data: value },
                    success: function (text) {
                        var json = mini.decode(text);
                        grid.updateRow(record, { staff_name: json.staff_name, dept: json.dept, grade: json.grade, kind: json.kind });
                        
                        var MyTime = new Date();
                        var now = mini.formatDate(MyTime, "yyyy-MM-dd HH:mm");
                        grid.updateRow(record, { create_user: txtUser, create_time: now });
                        
                        var dept = json.dept;
                        var kind = json.kind;
                        dept = dept.substr(dept.length - 3, 3);

                        if (dept == "手术科" & kind == "护理") {
                            grid.updateRow(record, { oper_nurse: "1" });
                        } else {
                            grid.updateRow(record, { oper_nurse: "0" });
                        }

                        grid.setCurrentCell([e.rowIndex, 7]);
                        grid.beginEditCell();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(jqXHR.responseText);
                    }
                });
            }
    

            if (field == "kind") {

                var dept = record.dept;
                var kind = record.kind;
                dept = dept.substr(dept.length - 3, 3);
               
                if (dept == "手术科" & kind == "护理") {
                    grid.updateRow(record, { oper_nurse: "1" });
                }

            }




            if (field == "start_time") {
                grid.updateRow(record, { end_time: mini.formatDate(e.value, "yyyy-MM-dd HH:mm")});

            }


            if (field == "patient_id") {
                $.ajax({
                    url: "StaffService.aspx?method=GetPatInfo",
                    data:{data:value},
                    success: function (text) {
                        var json = mini.decode(text);
                        grid.updateRow(record, { pat_name: json.pat_name, diagnosis: json.diagnosis });

                        grid.setCurrentCell([e.rowIndex, 12]);
                        grid.beginEditCell();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(jqXHR.responseText);
                    }
                });

            }
        }


        function saveData() {
            grid.commitEdit();
            //检验数据
            grid.validate();
            if (grid.isValid() == false) {
                mini.alert("请校验颜色改变的输入单元格内容，不能为空！");
                var error = grid.getCellErrors()[0];
                grid.beginEditCell(error.record, error.column);
                return;
            }

            var data = grid.getChanges();
            var json = mini.encode(data);

            grid.loading("保存中，请稍后......");
            $.ajax({
                url: "StaffService.aspx?method=SaveStaff",
                data: { data: json },
                type: "post",
                success: function (text) {
  
                      grid.reload({ key: txtUser });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(jqXHR.responseText);
                }
            });
        }

    </script>

    <div class="description">
        <h3>操作说明</h3>
        <ul>
            <li>表中只显示最近2天本人录入的加班记录，历史记录只能由审核人员修改</li>
            <li>输入工号或病人住院号之后，按回车键获取加班人员信息或病人信息。若信息不正确，请手动更改</li>            
            <li>门诊病人信息请手动录入，门诊号、姓名不能为空</li>
            <li>器械科等非临床科室报加班，住院号、姓名请录入【无】，诊断录入【器械维修】</li>
            <li>同一个病人多人次报加班，请先填写一条记录，选中之后单击【复制新增】按钮，可以快速录入加班信息</li>
        </ul>
        <p>
            &nbsp;</p>
    </div>
     </form>
</body>
</html>
