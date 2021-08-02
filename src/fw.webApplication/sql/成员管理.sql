if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWMemberInfo') and o.name = 'FK_FWMEMBER_REFERENCE_FWMODULE')
alter table FWMemberInfo
   drop constraint FK_FWMEMBER_REFERENCE_FWMODULE
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWModule')
            and   type = 'U')
   drop table FWModule
go

/*==============================================================*/
/* Table: FWModule                                              */
/*==============================================================*/
create table FWModule (
   id                   bigint               identity,
   moduleVersionId      varchar(36)          not null,
   name                 varchar(50)          not null,
   chineseName          varchar(50)          not null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWMODULE primary key (moduleVersionId)
)
go












if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWFieldInfo') and o.name = 'FK_FWFIELDI_REFERENCE_FWMEMBER')
alter table FWFieldInfo
   drop constraint FK_FWFIELDI_REFERENCE_FWMEMBER
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWMemberInfo') and o.name = 'FK_FWMEMBER_REFERENCE_FWMODULE')
alter table FWMemberInfo
   drop constraint FK_FWMEMBER_REFERENCE_FWMODULE
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWMethodInfo') and o.name = 'FK_FWMETHOD_REFERENCE_FWMEMBER')
alter table FWMethodInfo
   drop constraint FK_FWMETHOD_REFERENCE_FWMEMBER
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWPropertyInfo') and o.name = 'FK_FWPROPER_REFERENCE_FWMEMBER')
alter table FWPropertyInfo
   drop constraint FK_FWPROPER_REFERENCE_FWMEMBER
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWType') and o.name = 'FK_FWTYPE_REFERENCE_FWMEMBER')
alter table FWType
   drop constraint FK_FWTYPE_REFERENCE_FWMEMBER
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWMemberInfo')
            and   type = 'U')
   drop table FWMemberInfo
go

/*==============================================================*/
/* Table: FWMemberInfo                                          */
/*==============================================================*/
create table FWMemberInfo (
   id                   bigint               identity,
   moduleVersionId      varchar(36)          not null,
   metadataToken        varchar(36)          not null,
   name                 varchar(50)          not null,
   chineseName          varchar(50)          not null,
   mapName              varchar(50)          not null,
   chineseMapName       varchar(50)          not null,
   memberType           int                  not null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWMEMBERINFO primary key (metadataToken)
)
go

alter table FWMemberInfo
   add constraint FK_FWMEMBER_REFERENCE_FWMODULE foreign key (moduleVersionId)
      references FWModule (moduleVersionId)
go










if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWFieldInfo') and o.name = 'FK_FWFIELDI_REFERENCE_FWTYPE')
alter table FWFieldInfo
   drop constraint FK_FWFIELDI_REFERENCE_FWTYPE
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWMethodInfo') and o.name = 'FK_FWMETHOD_REFERENCE_FWTYPE')
alter table FWMethodInfo
   drop constraint FK_FWMETHOD_REFERENCE_FWTYPE
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWPropertyInfo') and o.name = 'FK_FWPROPER_REFERENCE_FWTYPE')
alter table FWPropertyInfo
   drop constraint FK_FWPROPER_REFERENCE_FWTYPE
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWType') and o.name = 'FK_FWTYPE_REFERENCE_FWMEMBER')
alter table FWType
   drop constraint FK_FWTYPE_REFERENCE_FWMEMBER
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWType')
            and   type = 'U')
   drop table FWType
go

/*==============================================================*/
/* Table: FWType                                                */
/*==============================================================*/
create table FWType (
   id                   bigint               identity,
   metadataToken        varchar(36)          not null,
   fullName             varchar(50)          not null,
   namespace            varchar(50)          not null,
   rem                  varchar(200)         null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWTYPE primary key (metadataToken)
)
go

alter table FWType
   add constraint FK_FWTYPE_REFERENCE_FWMEMBER foreign key (metadataToken)
      references FWMemberInfo (metadataToken)
go















if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWPropertyInfo') and o.name = 'FK_FWPROPER_REFERENCE_FWMEMBER')
alter table FWPropertyInfo
   drop constraint FK_FWPROPER_REFERENCE_FWMEMBER
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWPropertyInfo') and o.name = 'FK_FWPROPER_REFERENCE_FWTYPE')
alter table FWPropertyInfo
   drop constraint FK_FWPROPER_REFERENCE_FWTYPE
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWPropertyInfo')
            and   type = 'U')
   drop table FWPropertyInfo
go

/*==============================================================*/
/* Table: FWPropertyInfo                                        */
/*==============================================================*/
create table FWPropertyInfo (
   id                   bigint               identity,
   typeMetadataToken    varchar(36)          not null,
   metadataToken        varchar(36)          not null,
   propertyType         varchar(36)          not null,
   defaultValue         varchar(100)         null,
   textValue            varchar(100)         null,
   dataLen              bigint               null,
   isNull               int                  not null,
   isPK                 int                  null,
   rem                  varchar(200)         null,
   ix                   int                  not null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWPROPERTYINFO primary key (metadataToken)
)
go

alter table FWPropertyInfo
   add constraint FK_FWPROPER_REFERENCE_FWMEMBER foreign key (metadataToken)
      references FWMemberInfo (metadataToken)
go

alter table FWPropertyInfo
   add constraint FK_FWPROPER_REFERENCE_FWTYPE foreign key (typeMetadataToken)
      references FWType (metadataToken)
go
















if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWFieldInfo') and o.name = 'FK_FWFIELDI_REFERENCE_FWMEMBER')
alter table FWFieldInfo
   drop constraint FK_FWFIELDI_REFERENCE_FWMEMBER
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWFieldInfo') and o.name = 'FK_FWFIELDI_REFERENCE_FWTYPE')
alter table FWFieldInfo
   drop constraint FK_FWFIELDI_REFERENCE_FWTYPE
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWFieldInfo')
            and   type = 'U')
   drop table FWFieldInfo
go

/*==============================================================*/
/* Table: FWFieldInfo                                           */
/*==============================================================*/
create table FWFieldInfo (
   id                   bigint               identity,
   typeMetadataToken    varchar(36)          not null,
   metadataToken        varchar(36)          not null,
   fieldType            varchar(36)          not null,
   defaultValue         varchar(100)         null,
   textValue            varchar(100)         null,
   rem                  varchar(200)         null,
   ix                   int                  not null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWFIELDINFO primary key (metadataToken)
)
go

alter table FWFieldInfo
   add constraint FK_FWFIELDI_REFERENCE_FWMEMBER foreign key (metadataToken)
      references FWMemberInfo (metadataToken)
go

alter table FWFieldInfo
   add constraint FK_FWFIELDI_REFERENCE_FWTYPE foreign key (typeMetadataToken)
      references FWType (metadataToken)
go














if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWMethodInfo') and o.name = 'FK_FWMETHOD_REFERENCE_FWMEMBER')
alter table FWMethodInfo
   drop constraint FK_FWMETHOD_REFERENCE_FWMEMBER
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWMethodInfo') and o.name = 'FK_FWMETHOD_REFERENCE_FWTYPE')
alter table FWMethodInfo
   drop constraint FK_FWMETHOD_REFERENCE_FWTYPE
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWParameterInfo') and o.name = 'FK_FWPARAME_REFERENCE_FWMETHOD')
alter table FWParameterInfo
   drop constraint FK_FWPARAME_REFERENCE_FWMETHOD
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWMethodInfo')
            and   type = 'U')
   drop table FWMethodInfo
go

/*==============================================================*/
/* Table: FWMethodInfo                                          */
/*==============================================================*/
create table FWMethodInfo (
   id                   bigint               identity,
   typeMetadataToken    varchar(36)          not null,
   metadataToken        varchar(36)          not null,
   returnType           varchar(36)          null,
   rem                  varchar(200)         null,
   ix                   int                  not null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWMETHODINFO primary key (metadataToken)
)
go

alter table FWMethodInfo
   add constraint FK_FWMETHOD_REFERENCE_FWMEMBER foreign key (metadataToken)
      references FWMemberInfo (metadataToken)
go

alter table FWMethodInfo
   add constraint FK_FWMETHOD_REFERENCE_FWTYPE foreign key (typeMetadataToken)
      references FWType (metadataToken)
go















if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('FWParameterInfo') and o.name = 'FK_FWPARAME_REFERENCE_FWMETHOD')
alter table FWParameterInfo
   drop constraint FK_FWPARAME_REFERENCE_FWMETHOD
go

if exists (select 1
            from  sysobjects
           where  id = object_id('FWParameterInfo')
            and   type = 'U')
   drop table FWParameterInfo
go

/*==============================================================*/
/* Table: FWParameterInfo                                       */
/*==============================================================*/
create table FWParameterInfo (
   id                   bigint               identity,
   methodMetadataToken  varchar(36)          not null,
   metadataToken        varchar(36)          not null,
   name                 varchar(50)          not null,
   chineseName          varchar(50)          not null,
   parameterType        char(10)             null,
   defaultValue         varchar(50)          null,
   testValue            varchar(50)          null,
   rem                  varchar(200)         null,
   ix                   int                  not null,
   isDel                int                  not null,
   createrID            varchar(36)          not null,
   createTime           datetime             not null,
   updaterID            varchar(36)          not null,
   updateTime           datetime             not null,
   constraint PK_FWPARAMETERINFO primary key (metadataToken)
)
go

alter table FWParameterInfo
   add constraint FK_FWPARAME_REFERENCE_FWMETHOD foreign key (methodMetadataToken)
      references FWMethodInfo (metadataToken)
go
