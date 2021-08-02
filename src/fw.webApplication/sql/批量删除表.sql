--删除所有外键
DECLARE c1 cursor for    
	select 'alter table ['+ object_name(parent_obj) + '] drop constraint ['+name+']; '    
	from sysobjects    where xtype = 'F'
open c1
declare @c1 varchar(8000)
fetch next from c1 into @c1
while(@@fetch_status=0)    
	begin        
		exec(@c1)        
		fetch next from c1 into @c1    
	end
close c1
deallocate c1

--删除指定表所有外键
DECLARE c1 cursor for    
	select 'alter table ['+ object_name(a.parent_obj) + '] drop constraint ['+a.name+']; ' 
	from sysobjects  a
inner join sysobjects b on a.parent_obj=b.id and b.xtype = 'U'
where a.xtype = 'F' and b.name like 'T_Dat_WFQM_Data%' 
open c1
declare @c1 varchar(8000)
fetch next from c1 into @c1
while(@@fetch_status=0)    
	begin        
		exec(@c1)        
		fetch next from c1 into @c1    
	end
close c1
deallocate c1


declare @tname varchar(8000)set @tname=''
select @tname=@tname + Name + ',' from sysobjects where xtype='U' and name like 'T_Dat_WF%'
select @tname='drop table ' + left(@tname,len(@tname)-1)
exec(@tname)



declare @tname varchar(8000)set @tname=''
select @tname=@tname + Name + ',' from sysobjects where xtype='P' and name like 'TK_PROC_%'
select @tname='drop PROCEDURE ' + left(@tname,len(@tname)-1)
exec(@tname)


select * from sysobjects where xtype='P' and name like 'TK_PROC_%'

select *  from sysobjects where xtype='U' and name like 'T_Dat_WF%'

