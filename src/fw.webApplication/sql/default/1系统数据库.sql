/*==============================================================*/
/* DBMS name:      Microsoft SQL Server 2008                    */
/* Created on:     2014/12/3 13:35:22                           */
/*==============================================================*/


if exists (select 1
          from sysobjects
          where  id = object_id('fw_PageProcedure')
          and type in ('P','PC'))
   drop procedure fw_PageProcedure
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWAppInstallInfoLog') and o.name = 'FK_FWAPPINS_FK__FWAPP_FWAPP')
alter table FWAppInstallInfoLog
   drop constraint FK_FWAPPINS_FK__FWAPP_FWAPP
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWAppLoginLog') and o.name = 'FK_FWAPPLOG_FK__FWAPP_FWAPP')
alter table FWAppLoginLog
   drop constraint FK_FWAPPLOG_FK__FWAPP_FWAPP
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWAppUser') and o.name = 'FK_FWAPPUSE_FK__FWAPP_FWAPP')
alter table FWAppUser
   drop constraint FK_FWAPPUSE_FK__FWAPP_FWAPP
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWAppUser') and o.name = 'FK_FWAPPUSE_FK__FWUSE_FWUSERLO')
alter table FWAppUser
   drop constraint FK_FWAPPUSE_FK__FWUSE_FWUSERLO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWAutomaticLoginUser') and o.name = 'FK__FWUserLogin__FWAutomaticLoginUser')
alter table FWAutomaticLoginUser
   drop constraint FK__FWUserLogin__FWAutomaticLoginUser
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWDeviceLogin') and o.name = 'FK__FWDeviceType__FWDeviceLogin')
alter table FWDeviceLogin
   drop constraint FK__FWDeviceType__FWDeviceLogin
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWDeviceLogin') and o.name = 'FK__FWUserLogin__FWDeviceLogin')
alter table FWDeviceLogin
   drop constraint FK__FWUserLogin__FWDeviceLogin
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWDictionary') and o.name = 'FK_FWDICTIO_FW__FWDIC_FWDICTIO')
alter table FWDictionary
   drop constraint FK_FWDICTIO_FW__FWDIC_FWDICTIO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWFieldInfo') and o.name = 'FK__FWMemberInfo__FWFieldInfo')
alter table FWFieldInfo
   drop constraint FK__FWMemberInfo__FWFieldInfo
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWFieldInfo') and o.name = 'FK__FWType__FWFieldInfo')
alter table FWFieldInfo
   drop constraint FK__FWType__FWFieldInfo
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWFunction') and o.name = 'FK__FWBllModule__FWFunction')
alter table FWFunction
   drop constraint FK__FWBllModule__FWFunction
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWGenericTypeArguments') and o.name = 'FK__FWType__FWGenericTypeArguments')
alter table FWGenericTypeArguments
   drop constraint FK__FWType__FWGenericTypeArguments
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWMemberInfo') and o.name = 'FK__FWModule__FWMemberInfo')
alter table FWMemberInfo
   drop constraint FK__FWModule__FWMemberInfo
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWMethodInfo') and o.name = 'FK__FWMemberInfo__FWMethodInfo')
alter table FWMethodInfo
   drop constraint FK__FWMemberInfo__FWMethodInfo
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWMethodInfo') and o.name = 'FK__FWType__FWMethodInfo')
alter table FWMethodInfo
   drop constraint FK__FWType__FWMethodInfo
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWParameterInfo') and o.name = 'FK__FWMethodInfo__FWParameterInfo')
alter table FWParameterInfo
   drop constraint FK__FWMethodInfo__FWParameterInfo
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWPropertyInfo') and o.name = 'FK__FWMemberInfo__FWPropertyInfo')
alter table FWPropertyInfo
   drop constraint FK__FWMemberInfo__FWPropertyInfo
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWPropertyInfo') and o.name = 'FK__FWType__FWPropertyInfo')
alter table FWPropertyInfo
   drop constraint FK__FWType__FWPropertyInfo
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWRoleMappingDictionary') and o.name = 'FK_FWROLEMA_FK__FWDIC_FWDICTIO')
alter table FWRoleMappingDictionary
   drop constraint FK_FWROLEMA_FK__FWDIC_FWDICTIO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWRoleMappingDictionary') and o.name = 'FK_FWROLEMA_FK__FWUSE_FWUSERRO')
alter table FWRoleMappingDictionary
   drop constraint FK_FWROLEMA_FK__FWUSE_FWUSERRO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWRoleMappingFunction') and o.name = 'FK__FWFunction__FWRoleMappingFunction')
alter table FWRoleMappingFunction
   drop constraint FK__FWFunction__FWRoleMappingFunction
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWRoleMappingFunction') and o.name = 'FK__FWUserRole__FWRoleMappingFunction')
alter table FWRoleMappingFunction
   drop constraint FK__FWUserRole__FWRoleMappingFunction
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWRoleMappingMenu') and o.name = 'FK__FWMenu__FWRoleMappingMenu')
alter table FWRoleMappingMenu
   drop constraint FK__FWMenu__FWRoleMappingMenu
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWRoleMappingMenu') and o.name = 'FK__FWUserRole__FWRoleMappingMenu')
alter table FWRoleMappingMenu
   drop constraint FK__FWUserRole__FWRoleMappingMenu
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWSystemLog') and o.name = 'FK__FWUserLogin__FWSystemLog')
alter table FWSystemLog
   drop constraint FK__FWUserLogin__FWSystemLog
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWType') and o.name = 'FK__FWMemberInfo__FWType')
alter table FWType
   drop constraint FK__FWMemberInfo__FWType
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWUserInfo') and o.name = 'FK_FWUSERIN_FK__FWUSE_FWUSERLO')
alter table FWUserInfo
   drop constraint FK_FWUSERIN_FK__FWUSE_FWUSERLO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWUserLogin') and o.name = 'FK_FWUSERLO_FK__FWUSE_FWUSERTY')
alter table FWUserLogin
   drop constraint FK_FWUSERLO_FK__FWUSE_FWUSERTY
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWUserMappingDictionary') and o.name = 'FK_FWUSERMA_FW__FWDIC_FWDICTIO')
alter table FWUserMappingDictionary
   drop constraint FK_FWUSERMA_FW__FWDIC_FWDICTIO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWUserMappingDictionary') and o.name = 'FK_FWUSERMA_FW__FWUSE_FWUSERLO1')
alter table FWUserMappingDictionary
   drop constraint FK_FWUSERMA_FW__FWUSE_FWUSERLO1
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWUserMappingFunction') and o.name = 'FK__FWFunction__FWUserMappingFunction')
alter table FWUserMappingFunction
   drop constraint FK__FWFunction__FWUserMappingFunction
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWUserMappingFunction') and o.name = 'FK__FWUserLogin__FWUserMappingFunction')
alter table FWUserMappingFunction
   drop constraint FK__FWUserLogin__FWUserMappingFunction
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWUserMappingMenu') and o.name = 'FK_FWUSERMA_FW__FWMEN_FWMENU')
alter table FWUserMappingMenu
   drop constraint FK_FWUSERMA_FW__FWMEN_FWMENU
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWUserMappingMenu') and o.name = 'FK_FWUSERMA_FW__FWUSE_FWUSERLO')
alter table FWUserMappingMenu
   drop constraint FK_FWUSERMA_FW__FWUSE_FWUSERLO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWUserMappingRole') and o.name = 'FK__FWUserLogin__FWUserMappingRole')
alter table FWUserMappingRole
   drop constraint FK__FWUserLogin__FWUserMappingRole
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWUserMappingRole') and o.name = 'FK__FWUserRole__FWUserMappingRole')
alter table FWUserMappingRole
   drop constraint FK__FWUserRole__FWUserMappingRole
go

if exists (select 1
            from  sysobjects
           where  id = object_id('fw_FWType')
            and   type = 'V')
   drop view fw_FWType
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWApp')
            and   type = 'U')
   drop table FWApp
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWAppInstallInfoLog')
            and   type = 'U')
   drop table FWAppInstallInfoLog
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWAppLoginLog')
            and   type = 'U')
   drop table FWAppLoginLog
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWAppUser')
            and   type = 'U')
   drop table FWAppUser
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWAutomaticLoginUser')
            and   type = 'U')
   drop table FWAutomaticLoginUser
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWBllModule')
            and   type = 'U')
   drop table FWBllModule
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWDeviceLogin')
            and   type = 'U')
   drop table FWDeviceLogin
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWDeviceType')
            and   type = 'U')
   drop table FWDeviceType
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWDictionary')
            and   type = 'U')
   drop table FWDictionary
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWDictionaryExtendTableColumn')
            and   type = 'U')
   drop table FWDictionaryExtendTableColumn
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWDictionaryType')
            and   type = 'U')
   drop table FWDictionaryType
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWDisableIp')
            and   type = 'U')
   drop table FWDisableIp
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWFieldInfo')
            and   type = 'U')
   drop table FWFieldInfo
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWFunction')
            and   type = 'U')
   drop table FWFunction
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWGenericTypeArguments')
            and   type = 'U')
   drop table FWGenericTypeArguments
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWMemberInfo')
            and   type = 'U')
   drop table FWMemberInfo
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWMenu')
            and   type = 'U')
   drop table FWMenu
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWMethodInfo')
            and   type = 'U')
   drop table FWMethodInfo
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWModule')
            and   type = 'U')
   drop table FWModule
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWParameterInfo')
            and   type = 'U')
   drop table FWParameterInfo
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWPropertyInfo')
            and   type = 'U')
   drop table FWPropertyInfo
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWRoleMappingDictionary')
            and   type = 'U')
   drop table FWRoleMappingDictionary
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWRoleMappingFunction')
            and   type = 'U')
   drop table FWRoleMappingFunction
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWRoleMappingMenu')
            and   type = 'U')
   drop table FWRoleMappingMenu
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWSystemLog')
            and   type = 'U')
   drop table FWSystemLog
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWTimingTask')
            and   type = 'U')
   drop table FWTimingTask
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWType')
            and   type = 'U')
   drop table FWType
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWUserInfo')
            and   type = 'U')
   drop table FWUserInfo
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWUserLogin')
            and   type = 'U')
   drop table FWUserLogin
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWUserMappingDictionary')
            and   type = 'U')
   drop table FWUserMappingDictionary
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWUserMappingFunction')
            and   type = 'U')
   drop table FWUserMappingFunction
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWUserMappingMenu')
            and   type = 'U')
   drop table FWUserMappingMenu
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWUserMappingRole')
            and   type = 'U')
   drop table FWUserMappingRole
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWUserRole')
            and   type = 'U')
   drop table FWUserRole
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWUserType')
            and   type = 'U')
   drop table FWUserType
go

/*==============================================================*/
/* Table: FWApp                                                 */
/*==============================================================*/
create table FWApp (
   id                   bigint               identity,
   dataID               varchar(36)          not null,
   appCode              varchar(36)          not null,
   appName              varchar(36)          null,
   appRootDirectory     varchar(256)         not null,
   remark               varchar(256)         null,
   appInstallStatus     varchar(36)          not null,
   appInstallInfo       text                 null,
   isDis                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWAPP primary key (appCode)
)
go

/*==============================================================*/
/* Table: FWAppInstallInfoLog                                   */
/*==============================================================*/
create table FWAppInstallInfoLog (
   id                   bigint               identity,
   appInstallInfoLogCode varchar(36)          not null,
   appCode              varchar(36)          not null,
   appRootDirectory     varchar(256)         not null,
   appInstallStatus     varchar(36)          not null,
   appInstallInfo       text                 null,
   status               varchar(36)          not null,
   infos                text                 null,
   callTime             datetime             not null,
   isSynchronize        int                  null,
   constraint PK_FWAPPINSTALLINFOLOG primary key (appInstallInfoLogCode)
)
go

/*==============================================================*/
/* Table: FWAppLoginLog                                         */
/*==============================================================*/
create table FWAppLoginLog (
   id                   bigint               identity,
   appLoginLogCode      varchar(36)          not null,
   appCode              varchar(36)          not null,
   referrerURL          varchar(2048)        not null,
   appRootDirectory     varchar(256)         not null,
   userID               varchar(36)          null,
   IPAddress            varchar(15)          null,
   port                 int                  null,
   useTime              float                not null,
   status               varchar(36)          not null,
   infos                text                 null,
   callTime             datetime             not null,
   isSynchronize        int                  null,
   constraint PK_FWAPPLOGINLOG primary key (appLoginLogCode)
)
go

/*==============================================================*/
/* Table: FWAppUser                                             */
/*==============================================================*/
create table FWAppUser (
   id                   bigint               identity,
   dataID               varchar(36)          not null,
   appCode              varchar(36)          not null,
   userID               varchar(36)          not null,
   isAdd                varchar(36)          null,
   userStatus           varchar(36)          null,
   isDis                varchar(36)          null,
   isDel                varchar(36)          null,
   rem                  varchar(256)         null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWAPPUSER primary key (dataID)
)
go

/*==============================================================*/
/* Table: FWAutomaticLoginUser                                  */
/*==============================================================*/
create table FWAutomaticLoginUser (
   id                   bigint               identity(1, 1),
   userID               varchar(36)          not null,
   userName             varchar(36)          null,
   ticket               varchar(36)          not null,
   ix                   int                  not null,
   isDis                int                  not null default 0,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWAUTOMATICLOGINUSER primary key (userID)
)
on "PRIMARY"
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户ID',
   'user', @CurrentUser, 'table', 'FWAutomaticLoginUser', 'column', 'userID'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '是否启用',
   'user', @CurrentUser, 'table', 'FWAutomaticLoginUser', 'column', 'isDis'
go

/*==============================================================*/
/* Table: FWBllModule                                           */
/*==============================================================*/
create table FWBllModule (
   id                   bigint               identity,
   dataID               varchar(36)          not null,
   bllModuleCode        varchar(36)          not null,
   pBllModuleCode       varchar(36)          null,
   bllModuleName        varchar(36)          null,
   rem                  varchar(256)         null,
   ix                   int                  not null,
   isDis                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWBLLMODULE primary key (bllModuleCode)
)
go

/*==============================================================*/
/* Table: FWDeviceLogin                                         */
/*==============================================================*/
create table FWDeviceLogin (
   id                   bigint               identity(1, 1),
   dataID               varchar(36)          not null,
   deviceTypeCode       varchar(36)          not null,
   deviceCode           varchar(256)         not null,
   userID               varchar(36)          null,
   bindTime             datetime             null,
   isDis                int                  not null default 0,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWDEVICELOGIN primary key (dataID)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户ID',
   'user', @CurrentUser, 'table', 'FWDeviceLogin', 'column', 'userID'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '是否启用',
   'user', @CurrentUser, 'table', 'FWDeviceLogin', 'column', 'isDis'
go

/*==============================================================*/
/* Table: FWDeviceType                                          */
/*==============================================================*/
create table FWDeviceType (
   id                   bigint               identity(1, 1),
   dataID               varchar(36)          not null,
   deviceTypeCode       varchar(36)          not null,
   deviceTypeName       varchar(36)          not null,
   rem                  varchar(256)         null,
   ix                   int                  not null,
   isDis                int                  not null default 0,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWDEVICETYPE primary key (deviceTypeCode)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '是否启用',
   'user', @CurrentUser, 'table', 'FWDeviceType', 'column', 'isDis'
go

/*==============================================================*/
/* Table: FWDictionary                                          */
/*==============================================================*/
create table FWDictionary (
   id                   bigint               identity,
   dataID               varchar(36)          not null,
   dictionaryTypeCode   varchar(36)          not null,
   code                 varchar(36)          not null,
   pCode                varchar(36)          not null,
   name                 varchar(128)         not null,
   ix                   int                  not null,
   isDis                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWDICTIONARY primary key (dataID)
)
go

/*==============================================================*/
/* Table: FWDictionaryExtendTableColumn                         */
/*==============================================================*/
create table FWDictionaryExtendTableColumn (
   id                   bigint               identity,
   dataID               varchar(36)          not null,
   extendTableName      varchar(128)         not null,
   columnName           varchar(128)         not null,
   columnChineseName    varchar(128)         not null,
   columnType           varchar(36)          not null,
   dataLen              bigint               null,
   isNull               int                  not null,
   ix                   int                  not null,
   isDis                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null
)
go

/*==============================================================*/
/* Table: FWDictionaryType                                      */
/*==============================================================*/
create table FWDictionaryType (
   id                   bigint               identity,
   dataID               varchar(36)          not null,
   dictionaryTypeCode   varchar(36)          not null,
   dictionaryTypeName   varchar(36)          not null,
   isMapping            int                  not null default 0,
   extendTableName      varchar(128)         null,
   extendTableChineseName varchar(128)         null,
   ix                   int                  not null,
   isDis                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWDICTIONARYTYPE primary key (dictionaryTypeCode)
)
go

/*==============================================================*/
/* Table: FWDisableIp                                           */
/*==============================================================*/
create table FWDisableIp (
   id                   bigint               identity,
   dataID               varchar(36)          not null,
   disableIp            varchar(15)          not null,
   location             varchar(256)         null,
   isDis                int                  not null default 0,
   disTime              datetime             not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWDISABLEIP primary key (disableIp)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '是否启用',
   'user', @CurrentUser, 'table', 'FWDisableIp', 'column', 'isDis'
go

/*==============================================================*/
/* Table: FWFieldInfo                                           */
/*==============================================================*/
create table FWFieldInfo (
   id                   bigint               identity,
   typeMetadataToken    varchar(36)          not null,
   metadataToken        varchar(36)          not null,
   fieldType            varchar(36)          not null,
   defaultValue         varchar(128)         null,
   textValue            varchar(128)         null,
   rem                  varchar(256)         null,
   ix                   int                  not null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWFIELDINFO primary key (metadataToken)
)
go

/*==============================================================*/
/* Table: FWFunction                                            */
/*==============================================================*/
create table FWFunction (
   id                   bigint               identity,
   bllModuleCode        varchar(36)          not null,
   functionCode         varchar(36)          not null,
   functionName         varchar(36)          null,
   isVerifyRight        int                  not null default 1,
   isWriteLog           int                  not null default 1,
   rem                  varchar(256)         null,
   ix                   int                  not null,
   isDis                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWFUNCTION primary key (functionCode)
)
go

/*==============================================================*/
/* Table: FWGenericTypeArguments                                */
/*==============================================================*/
create table FWGenericTypeArguments (
   id                   bigint               identity,
   typeMetadataToken    varchar(36)          not null,
   metadataToken        varchar(36)          not null,
   genericType          varchar(36)          not null,
   ix                   int                  not null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWGENERICTYPEARGUMENTS primary key (metadataToken)
)
go

/*==============================================================*/
/* Table: FWMemberInfo                                          */
/*==============================================================*/
create table FWMemberInfo (
   id                   bigint               identity,
   moduleVersionId      varchar(36)          not null,
   metadataToken        varchar(36)          not null,
   name                 varchar(256)         not null,
   chineseName          varchar(256)         not null,
   mapName              varchar(256)         not null,
   chineseMapName       varchar(256)         not null,
   memberType           varchar(36)          not null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWMEMBERINFO primary key (metadataToken)
)
go

/*==============================================================*/
/* Table: FWMenu                                                */
/*==============================================================*/
create table FWMenu (
   id                   bigint               identity(1, 1),
   menuTypeCode         varchar(36)          not null,
   pMenuCode            varchar(36)          null,
   menuCode             varchar(36)          not null,
   menuName             varchar(36)          not null,
   iconUrl              varchar(512)         null,
   title                varchar(36)          null,
   isHtmlPage           int                  null default 1,
   windowName           varchar(36)          null,
   url                  varchar(512)         null,
   urlParamsJson        varchar(2048)        null,
   openTypeCode         varchar(36)          null,
   layoutHorizontalAlignment int                  null,
   layoutVerticalAlignment int                  null,
   layoutTop            int                  null,
   layoutRight          int                  null,
   layoutBottom         int                  null,
   layoutLeft           int                  null,
   layoutWidth          int                  null,
   layoutHeight         int                  null,
   infoNumber           int                  null,
   onFocusInScriptCode  varchar(Max)         null,
   onFocusOutScriptCode varchar(Max)         null,
   ix                   int                  not null,
   isDis                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWMENU primary key (menuCode)
)
on "PRIMARY"
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户ID',
   'user', @CurrentUser, 'table', 'FWMenu', 'column', 'menuCode'
go

/*==============================================================*/
/* Table: FWMethodInfo                                          */
/*==============================================================*/
create table FWMethodInfo (
   id                   bigint               identity,
   typeMetadataToken    varchar(36)          not null,
   metadataToken        varchar(36)          not null,
   returnType           varchar(36)          null,
   rem                  varchar(256)         null,
   ix                   int                  not null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWMETHODINFO primary key (metadataToken)
)
go

/*==============================================================*/
/* Table: FWModule                                              */
/*==============================================================*/
create table FWModule (
   id                   bigint               identity,
   moduleVersionId      varchar(36)          not null,
   name                 varchar(128)         not null,
   chineseName          varchar(128)         not null,
   rem                  varchar(256)         null,
   isSys                int                  not null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWMODULE primary key (moduleVersionId)
)
go

/*==============================================================*/
/* Table: FWParameterInfo                                       */
/*==============================================================*/
create table FWParameterInfo (
   id                   bigint               identity,
   methodMetadataToken  varchar(36)          not null,
   metadataToken        varchar(36)          not null,
   name                 varchar(128)         not null,
   chineseName          varchar(128)         not null,
   parameterType        varchar(36)          null,
   defaultValue         varchar(128)         null,
   testValue            varchar(128)         null,
   rem                  varchar(256)         null,
   ix                   int                  not null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWPARAMETERINFO primary key (metadataToken)
)
go

/*==============================================================*/
/* Table: FWPropertyInfo                                        */
/*==============================================================*/
create table FWPropertyInfo (
   id                   bigint               identity,
   typeMetadataToken    varchar(36)          not null,
   metadataToken        varchar(36)          not null,
   propertyType         varchar(36)          not null,
   defaultValue         varchar(128)         null,
   isUpdateResetDefaultValue int                  not null,
   textValue            varchar(128)         null,
   dataLen              bigint               null,
   isNull               int                  not null,
   isPK                 int                  null,
   rem                  varchar(256)         null,
   ix                   int                  not null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWPROPERTYINFO primary key (metadataToken)
)
go

/*==============================================================*/
/* Table: FWRoleMappingDictionary                               */
/*==============================================================*/
create table FWRoleMappingDictionary (
   id                   bigint               identity(1, 1),
   dataID               varchar(36)          not null,
   roleCode             varchar(36)          not null,
   dictionaryDataID     varchar(36)          not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWROLEMAPPINGDICTIONARY primary key (dataID)
)
on "PRIMARY"
go

/*==============================================================*/
/* Table: FWRoleMappingFunction                                 */
/*==============================================================*/
create table FWRoleMappingFunction (
   id                   bigint               identity(1, 1),
   dataID               varchar(36)          not null,
   roleCode             varchar(36)          not null,
   functionCode         varchar(36)          not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWROLEMAPPINGFUNCTION primary key (dataID)
)
go

/*==============================================================*/
/* Table: FWRoleMappingMenu                                     */
/*==============================================================*/
create table FWRoleMappingMenu (
   id                   bigint               identity(1, 1),
   dataID               varchar(36)          not null,
   roleCode             varchar(36)          not null,
   menuCode             varchar(36)          not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWROLEMAPPINGMENU primary key (dataID)
)
on "PRIMARY"
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户ID',
   'user', @CurrentUser, 'table', 'FWRoleMappingMenu', 'column', 'menuCode'
go

/*==============================================================*/
/* Table: FWSystemLog                                           */
/*==============================================================*/
create table FWSystemLog (
   id                   bigint               identity,
   systemLogCode        varchar(36)          not null,
   userID               varchar(36)          null,
   bllModuleCode        varchar(36)          null,
   functionCode         varchar(32)          null,
   ip                   varchar(15)          null,
   port                 int                  null,
   url                  varchar(2048)        null,
   urlReferrer          varchar(2048)        null,
   className            varchar(256)         null,
   methodName           varchar(128)         null,
   methodSignature      varchar(2048)        null,
   typeName             varchar(256)         null,
   args                 text                 null,
   isVerifyRight        int                  not null,
   useTime              float                not null,
   status               varchar(36)          not null,
   infos                text                 null,
   callTime             datetime             not null default getdate(),
   isSynchronize        int                  not null,
   constraint PK_FWSYSTEMLOG primary key (systemLogCode)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户ID',
   'user', @CurrentUser, 'table', 'FWSystemLog', 'column', 'userID'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户名称',
   'user', @CurrentUser, 'table', 'FWSystemLog', 'column', 'functionCode'
go

/*==============================================================*/
/* Table: FWTimingTask                                          */
/*==============================================================*/
create table FWTimingTask (
   id                   bigint               identity,
   timingTaskCode       varchar(36)          not null,
   timingTaskName       varchar(36)          not null,
   timingTypeCode       varchar(36)          not null,
   taskTypeCode         varchar(36)          not null,
   timingTaskEntry      varchar(512)         not null,
   timingTaskSettings   varchar(2048)        null default '-1',
   timingTime           datetime             not null default '1',
   timingSeconds        int                  not null default 1,
   lastSuccessExecuteTime datetime             not null default '999999999',
   rem                  varchar(256)         null,
   ix                   int                  not null,
   isDis                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWTIMINGTASK primary key (timingTaskCode)
)
go

/*==============================================================*/
/* Table: FWType                                                */
/*==============================================================*/
create table FWType (
   id                   bigint               identity,
   metadataToken        varchar(36)          not null,
   fullName             varchar(512)         not null,
   namespace            varchar(128)         not null,
   schemaName           varchar(128)         null,
   baseType             varchar(36)          null,
   objType              varchar(36)          not null,
   isGenericType        int                  null,
   rem                  varchar(256)         null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWTYPE primary key (metadataToken)
)
go

/*==============================================================*/
/* Table: FWUserInfo                                            */
/*==============================================================*/
create table FWUserInfo (
   id                   bigint               identity(1, 1),
   userID               varchar(36)          not null,
   userChineseName      varchar(36)          not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWUSERINFO primary key (userID)
)
on "PRIMARY"
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'ID',
   'user', @CurrentUser, 'table', 'FWUserInfo', 'column', 'id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户ID',
   'user', @CurrentUser, 'table', 'FWUserInfo', 'column', 'userID'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户名称',
   'user', @CurrentUser, 'table', 'FWUserInfo', 'column', 'userChineseName'
go

/*==============================================================*/
/* Table: FWUserLogin                                           */
/*==============================================================*/
create table FWUserLogin (
   id                   bigint               identity(1, 1),
   userID               varchar(36)          not null,
   userName             varchar(36)          not null,
   password             varchar(36)          not null,
   canBindDeviceCount   int                  not null default 1,
   userTypeCode         varchar(36)          not null,
   isDis                int                  not null default 0,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_System_UserLogin primary key nonclustered (userID)
         on "PRIMARY"
)
on "PRIMARY"
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'ID',
   'user', @CurrentUser, 'table', 'FWUserLogin', 'column', 'id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户ID',
   'user', @CurrentUser, 'table', 'FWUserLogin', 'column', 'userID'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户名称',
   'user', @CurrentUser, 'table', 'FWUserLogin', 'column', 'userName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户密码',
   'user', @CurrentUser, 'table', 'FWUserLogin', 'column', 'password'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '是否启用',
   'user', @CurrentUser, 'table', 'FWUserLogin', 'column', 'isDis'
go

/*==============================================================*/
/* Table: FWUserMappingDictionary                               */
/*==============================================================*/
create table FWUserMappingDictionary (
   id                   bigint               identity(1, 1),
   dataID               varchar(36)          not null,
   userID               varchar(36)          not null,
   dictionaryDataID     varchar(36)          not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWUSERMAPPINGDICTIONARY primary key (dataID)
)
on "PRIMARY"
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户ID',
   'user', @CurrentUser, 'table', 'FWUserMappingDictionary', 'column', 'userID'
go

/*==============================================================*/
/* Table: FWUserMappingFunction                                 */
/*==============================================================*/
create table FWUserMappingFunction (
   id                   bigint               identity(1, 1),
   dataID               varchar(36)          not null,
   userID               varchar(36)          null,
   functionCode         varchar(36)          null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWUSERMAPPINGFUNCTION primary key (dataID)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户ID',
   'user', @CurrentUser, 'table', 'FWUserMappingFunction', 'column', 'userID'
go

/*==============================================================*/
/* Table: FWUserMappingMenu                                     */
/*==============================================================*/
create table FWUserMappingMenu (
   id                   bigint               identity(1, 1),
   dataID               varchar(36)          not null,
   userID               varchar(36)          not null,
   menuCode             varchar(36)          not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWUSERMAPPINGMENU primary key (dataID)
)
on "PRIMARY"
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户ID',
   'user', @CurrentUser, 'table', 'FWUserMappingMenu', 'column', 'userID'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户ID',
   'user', @CurrentUser, 'table', 'FWUserMappingMenu', 'column', 'menuCode'
go

/*==============================================================*/
/* Table: FWUserMappingRole                                     */
/*==============================================================*/
create table FWUserMappingRole (
   id                   bigint               identity(1, 1),
   dataID               varchar(36)          not null,
   userID               varchar(36)          not null,
   roleCode             varchar(36)          not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWUSERMAPPINGROLE primary key (dataID)
)
on "PRIMARY"
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户ID',
   'user', @CurrentUser, 'table', 'FWUserMappingRole', 'column', 'userID'
go

/*==============================================================*/
/* Table: FWUserRole                                            */
/*==============================================================*/
create table FWUserRole (
   id                   bigint               identity(1, 1),
   dataID               varchar(36)          not null,
   roleCode             varchar(36)          not null,
   pRoleCode            varchar(36)          not null,
   roleName             varchar(36)          not null,
   entry                varchar(512)         null,
   entryParamsJson      varchar(2048)        null,
   rem                  varchar(256)         null,
   ix                   int                  not null,
   isDis                int                  not null default 0,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWUSERROLE primary key (roleCode)
)
on "PRIMARY"
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '是否启用',
   'user', @CurrentUser, 'table', 'FWUserRole', 'column', 'isDis'
go

/*==============================================================*/
/* Table: FWUserType                                            */
/*==============================================================*/
create table FWUserType (
   id                   bigint               identity(1, 1),
   dataID               varchar(36)          not null,
   userTypeCode         varchar(36)          not null,
   userTypeName         varchar(36)          not null,
   isDistribute         int                  not null,
   rem                  varchar(256)         null,
   isDis                int                  not null default 0,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWUSERTYPE primary key (userTypeCode)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '是否启用',
   'user', @CurrentUser, 'table', 'FWUserType', 'column', 'isDis'
go

/*==============================================================*/
/* View: fw_FWType                                              */
/*==============================================================*/
create view fw_FWType as
SELECT     dbo.FWType.id, dbo.FWModule.moduleVersionId, dbo.FWModule.name AS moduleName, dbo.FWModule.chineseName AS moduleChineseName, 
                      dbo.FWMemberInfo.metadataToken, dbo.FWMemberInfo.name, dbo.FWMemberInfo.chineseName, dbo.FWMemberInfo.mapName, 
                      dbo.FWMemberInfo.chineseMapName, dbo.FWMemberInfo.memberType, dbo.FWType.fullName, dbo.FWType.namespace, dbo.FWType.schemaName, 
                      dbo.FWType.objType
FROM         dbo.FWType INNER JOIN
                      dbo.FWMemberInfo ON dbo.FWType.metadataToken = dbo.FWMemberInfo.metadataToken INNER JOIN
                      dbo.FWModule ON dbo.FWMemberInfo.moduleVersionId = dbo.FWModule.moduleVersionId
go

alter table FWAppInstallInfoLog
   add constraint FK_FWAPPINS_FK__FWAPP_FWAPP foreign key (appCode)
      references FWApp (appCode)
go

alter table FWAppLoginLog
   add constraint FK_FWAPPLOG_FK__FWAPP_FWAPP foreign key (appCode)
      references FWApp (appCode)
go

alter table FWAppUser
   add constraint FK_FWAPPUSE_FK__FWAPP_FWAPP foreign key (appCode)
      references FWApp (appCode)
go

alter table FWAppUser
   add constraint FK_FWAPPUSE_FK__FWUSE_FWUSERLO foreign key (userID)
      references FWUserLogin (userID)
go

alter table FWAutomaticLoginUser
   add constraint FK__FWUserLogin__FWAutomaticLoginUser foreign key (userID)
      references FWUserLogin (userID)
go

alter table FWDeviceLogin
   add constraint FK__FWDeviceType__FWDeviceLogin foreign key (deviceTypeCode)
      references FWDeviceType (deviceTypeCode)
go

alter table FWDeviceLogin
   add constraint FK__FWUserLogin__FWDeviceLogin foreign key (userID)
      references FWUserLogin (userID)
go

alter table FWDictionary
   add constraint FK_FWDICTIO_FW__FWDIC_FWDICTIO foreign key (dictionaryTypeCode)
      references FWDictionaryType (dictionaryTypeCode)
go

alter table FWFieldInfo
   add constraint FK__FWMemberInfo__FWFieldInfo foreign key (metadataToken)
      references FWMemberInfo (metadataToken)
go

alter table FWFieldInfo
   add constraint FK__FWType__FWFieldInfo foreign key (typeMetadataToken)
      references FWType (metadataToken)
go

alter table FWFunction
   add constraint FK__FWBllModule__FWFunction foreign key (bllModuleCode)
      references FWBllModule (bllModuleCode)
go

alter table FWGenericTypeArguments
   add constraint FK__FWType__FWGenericTypeArguments foreign key (typeMetadataToken)
      references FWType (metadataToken)
go

alter table FWMemberInfo
   add constraint FK__FWModule__FWMemberInfo foreign key (moduleVersionId)
      references FWModule (moduleVersionId)
go

alter table FWMethodInfo
   add constraint FK__FWMemberInfo__FWMethodInfo foreign key (metadataToken)
      references FWMemberInfo (metadataToken)
go

alter table FWMethodInfo
   add constraint FK__FWType__FWMethodInfo foreign key (typeMetadataToken)
      references FWType (metadataToken)
go

alter table FWParameterInfo
   add constraint FK__FWMethodInfo__FWParameterInfo foreign key (methodMetadataToken)
      references FWMethodInfo (metadataToken)
go

alter table FWPropertyInfo
   add constraint FK__FWMemberInfo__FWPropertyInfo foreign key (metadataToken)
      references FWMemberInfo (metadataToken)
go

alter table FWPropertyInfo
   add constraint FK__FWType__FWPropertyInfo foreign key (typeMetadataToken)
      references FWType (metadataToken)
go

alter table FWRoleMappingDictionary
   add constraint FK_FWROLEMA_FK__FWDIC_FWDICTIO foreign key (dictionaryDataID)
      references FWDictionary (dataID)
go

alter table FWRoleMappingDictionary
   add constraint FK_FWROLEMA_FK__FWUSE_FWUSERRO foreign key (roleCode)
      references FWUserRole (roleCode)
go

alter table FWRoleMappingFunction
   add constraint FK__FWFunction__FWRoleMappingFunction foreign key (functionCode)
      references FWFunction (functionCode)
go

alter table FWRoleMappingFunction
   add constraint FK__FWUserRole__FWRoleMappingFunction foreign key (roleCode)
      references FWUserRole (roleCode)
go

alter table FWRoleMappingMenu
   add constraint FK__FWMenu__FWRoleMappingMenu foreign key (menuCode)
      references FWMenu (menuCode)
go

alter table FWRoleMappingMenu
   add constraint FK__FWUserRole__FWRoleMappingMenu foreign key (roleCode)
      references FWUserRole (roleCode)
go

alter table FWSystemLog
   add constraint FK__FWUserLogin__FWSystemLog foreign key (userID)
      references FWUserLogin (userID)
go

alter table FWType
   add constraint FK__FWMemberInfo__FWType foreign key (metadataToken)
      references FWMemberInfo (metadataToken)
go

alter table FWUserInfo
   add constraint FK_FWUSERIN_FK__FWUSE_FWUSERLO foreign key (userID)
      references FWUserLogin (userID)
go

alter table FWUserLogin
   add constraint FK_FWUSERLO_FK__FWUSE_FWUSERTY foreign key (userTypeCode)
      references FWUserType (userTypeCode)
go

alter table FWUserMappingDictionary
   add constraint FK_FWUSERMA_FW__FWDIC_FWDICTIO foreign key (dictionaryDataID)
      references FWDictionary (dataID)
go

alter table FWUserMappingDictionary
   add constraint FK_FWUSERMA_FW__FWUSE_FWUSERLO1 foreign key (userID)
      references FWUserLogin (userID)
go

alter table FWUserMappingFunction
   add constraint FK__FWFunction__FWUserMappingFunction foreign key (functionCode)
      references FWFunction (functionCode)
go

alter table FWUserMappingFunction
   add constraint FK__FWUserLogin__FWUserMappingFunction foreign key (userID)
      references FWUserLogin (userID)
go

alter table FWUserMappingMenu
   add constraint FK_FWUSERMA_FW__FWMEN_FWMENU foreign key (menuCode)
      references FWMenu (menuCode)
go

alter table FWUserMappingMenu
   add constraint FK_FWUSERMA_FW__FWUSE_FWUSERLO foreign key (userID)
      references FWUserLogin (userID)
go

alter table FWUserMappingRole
   add constraint FK__FWUserLogin__FWUserMappingRole foreign key (userID)
      references FWUserLogin (userID)
go

alter table FWUserMappingRole
   add constraint FK__FWUserRole__FWUserMappingRole foreign key (roleCode)
      references FWUserRole (roleCode)
go


create procedure [dbo].[fw_PageProcedure]
@outRecordCount                                   bigint   output,                 --返回记录总数，好进行分页
@outPageSize                                      bigint   output,                         --每页显示的记录数
@outPageIndex                                       bigint   output,                         --当前页数

@pageSize                                      bigint,                         --每页显示的记录数
@pageIndex                                       bigint,                         --当前页数
@searchField                                   varchar(8000),                 --所要查询的字段的集合字符串
@afterFromBeforeOrderBySqlString               varchar(8000),                --SQL语句第一个from 到 最后一个 order 之间字符串
@orderByField                                  varchar(200)                 --最后一个order by 后面语句最后的字符串

as

--计算所有的记录条数 并返回
declare @@sqlCount    nvarchar(max)
--set  @@sqlCount=N' select @outRecordCount=COUNT(*) '+N' from '+ @afterFromBeforeOrderBySqlString
set  @@sqlCount=N' select @outRecordCount=COUNT(*) '+N' from (select '+@searchField+' from '+ @afterFromBeforeOrderBySqlString+') as tbCount'
exec sp_executesql @@sqlCount , N'@outRecordCount int output' , @outRecordCount output

--定义指定页需要查看的记录条数
if @pageIndex<=1            --优化第一页的查询，直接获得前@pageSize条记录
    begin
    set @pageIndex=1
   -- exec('  select top '+@pageSize+' '+@searchField+'
			--from '+@afterFromBeforeOrderBySqlString+'
			--order by '+@orderByField)

			declare @@sql  varchar(max)
			set @@sql= '  select top '+ltrim
		    (@pageSize)+' '+@searchField+'
			from '+@afterFromBeforeOrderBySqlString+'
			order by '+@orderByField
		    exec(@@sql)
			print  @@sql
    end

else
    begin
        declare @@PageCount   bigint
        declare @@IndexFrom   bigint
        declare @@IndexTo   bigint
        set @@PageCount=@outRecordCount/@pageSize
        if(@outRecordCount%@pageSize>0)
            begin
                set @@PageCount=@@PageCount+1
            end
        if(@pageIndex>=@@PageCount)
            begin
            set @pageIndex=@@PageCount
            set @@IndexFrom=(@pageIndex-1)*@pageSize+1
            set @@IndexTo =@outRecordCount
            end
        else
            begin
            set @@IndexFrom=(@pageIndex-1)*@pageSize+1
            set @@IndexTo =@pageIndex*@pageSize
            end

		exec('  select
				*
				from
					(select
						ROW_NUMBER() OVER(ORDER BY '+@orderByField+' ) PageProcedureRowNumber,'+@searchField+'
					from
						'+@afterFromBeforeOrderBySqlString+') PageProcedureTable
				where
					PageProcedureTable.PageProcedureRowNumber between '+@@IndexFrom+' and '+@@IndexTo)

    end

set @outPageSize=@pageSize
set @outPageIndex=@pageIndex
go

