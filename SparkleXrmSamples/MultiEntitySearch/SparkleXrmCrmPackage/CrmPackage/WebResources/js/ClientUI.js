// ClientUI.js
waitForScripts("client",["mscorlib","xrm","xrmui","jquery","jquery-ui"],function(){(function($){
Type.registerNamespace('SparkleXrm.GridEditor');SparkleXrm.GridEditor.VirtualPagedEntityDataViewModel=function(pageSize,entityType,lazyLoadPages){SparkleXrm.GridEditor.VirtualPagedEntityDataViewModel.initializeBase(this,[pageSize,entityType,lazyLoadPages]);this._entityType=entityType;this._lazyLoadPages=lazyLoadPages;this._data=[];this.paging.pageSize=pageSize;this.paging.pageNum=0;this.paging.totalPages=0;this.paging.totalRows=0;this.paging.fromRecord=0;this.paging.toRecord=0;}
SparkleXrm.GridEditor.VirtualPagedEntityDataViewModel.prototype={$2_0:0,$2_1:10,$2_2:false,getLength:function(){return this.paging.totalRows;},getItem:function(index){if((this.paging.totalRows>0)&&(index>((this.$2_0+1)*this.paging.pageSize))&&(index<=this.paging.totalRows)){this.$2_0++;this.paging.pageNum=this.$2_0;this.refresh();}return this._data[index];},reset:function(){SparkleXrm.GridEditor.VirtualPagedEntityDataViewModel.callBaseMethod(this, 'reset');this.$2_0=0;this.getPagingInfo().pageNum=0;this.getPagingInfo().totalRows=0;this.getPagingInfo().fromRecord=0;this.getPagingInfo().toRecord=0;this.setPagingOptions(this.getPagingInfo());},refresh:function(){this.$2_2=true;var $0=this.paging.pageNum*this.paging.pageSize;var $1=(!this.paging.totalRows)&&(this.deleteData!=null)&&(this.deleteData.length>0);var $2=[];if($0>=this.$2_0){this.onDataLoading.notify(null,null,null);var $4=this.applySorting();var $5;$5=this.paging.pageSize;if(String.isNullOrEmpty(this._fetchXml)){return;}var $6=String.format(this._fetchXml,$5,Xrm.Sdk.XmlHelper.encode(this.paging.extraInfo),this.paging.pageNum+1,$4);Xrm.Sdk.OrganizationServiceProxy.beginRetrieveMultiple($6,ss.Delegate.create(this,function($p1_0){
try{var $1_0=Xrm.Sdk.OrganizationServiceProxy.endRetrieveMultiple($p1_0,this._entityType);var $1_1=$0;if(this._lazyLoadPages){var $enum1=ss.IEnumerator.getEnumerator($1_0.get_entities());while($enum1.moveNext()){var $1_3=$enum1.current;this._data[$1_1]=$1_3;Xrm.ArrayEx.add($2,$1_1);$1_1=$1_1+1;}}else{this._data=$1_0.get_entities().items();}var $1_2={};$1_2.from=$0;$1_2.to=$0+this.paging.pageSize-1;this.paging.totalRows=$1_0.get_totalRecordCount();this.paging.extraInfo=$1_0.get_pagingCookie();this.paging.fromRecord=$0+1;this.paging.totalPages=Math.ceil($1_0.get_totalRecordCount()/this.paging.pageSize);this.paging.toRecord=Math.min($1_0.get_totalRecordCount(),$0+this.paging.pageSize);if(this._itemAdded){this.paging.totalRows++;this.paging.toRecord++;this._itemAdded=false;}this.onPagingInfoChanged.notify(this.getPagingInfo(),null,null);this.onDataLoaded.notify($1_2,null,null);}catch($1_4){this.errorMessage=$1_4.message;var $1_5={};$1_5.errorMessage=$1_4.message;this.onDataLoaded.notify($1_5,null,null);}}));}else{var $7={};$7.from=0;$7.to=this.paging.pageSize-1;this.paging.fromRecord=$0+1;this.paging.toRecord=Math.min(this.paging.totalRows,$0+this.paging.pageSize);this.onPagingInfoChanged.notify(this.getPagingInfo(),null,null);this.onDataLoaded.notify($7,null,null);this._itemAdded=false;}var $3={};$3.rows=$2;this.onRowsChanged.notify($3,null,this);this.$2_2=false;}}
Type.registerNamespace('Client.MultiEntitySearch.ViewModels');Client.MultiEntitySearch.ViewModels.ExecuteFetchRequest=function(){}
Client.MultiEntitySearch.ViewModels.ExecuteFetchRequest.prototype={fetchXml:null,serialise:function(){return String.format('<request i:type="b:ExecuteFetchRequest" xmlns:a="http://schemas.microsoft.com/xrm/2011/Contracts" xmlns:b="http://schemas.microsoft.com/crm/2011/Contracts">'+'        <a:Parameters xmlns:c="http://schemas.datacontract.org/2004/07/System.Collections.Generic">'+'          <a:KeyValuePairOfstringanyType>'+'            <c:key>FetchXml</c:key>'+'            <c:value i:type="d:string" xmlns:d="http://www.w3.org/2001/XMLSchema" >'+Xrm.Sdk.XmlHelper.encode(this.fetchXml)+'</c:value>'+'          </a:KeyValuePairOfstringanyType>'+'        </a:Parameters>'+'        <a:RequestId i:nil="true" />'+'        <a:RequestName>ExecuteFetch</a:RequestName>'+'      </request>');}}
Client.MultiEntitySearch.ViewModels.ExecuteFetchResponse=function(response){var $0=Xrm.Sdk.XmlHelper.selectSingleNode(response,'Results');var $enum1=ss.IEnumerator.getEnumerator($0.childNodes);while($enum1.moveNext()){var $1=$enum1.current;var $2=Xrm.Sdk.XmlHelper.selectSingleNode($1,'key');if(Xrm.Sdk.XmlHelper.getNodeTextValue($2)==='FetchXmlResult'){var $3=Xrm.Sdk.XmlHelper.selectSingleNode($1,'value');this.fetchXmlResult=Xrm.Sdk.XmlHelper.getNodeTextValue($3);}}}
Client.MultiEntitySearch.ViewModels.ExecuteFetchResponse.prototype={fetchXmlResult:null}
Client.MultiEntitySearch.ViewModels.MultiSearchViewModel=function(){this.searchTerm=ko.observable();this.config=ko.observableArray();Client.MultiEntitySearch.ViewModels.MultiSearchViewModel.initializeBase(this);var $0=Xrm.PageEx.getWebResourceData();var $1=[];var $2=[];if(Object.keyExists($0,'typeCodes')){$1=$0['typeCodes'].split(',');$2=$0['typeNames'].split(',');}else{$1=['1','2','4','4200','3'];$2=['account','contact','lead','activitypointer','opportunity'];}var $3="<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>\r\n                              <entity name='savedquery'>\r\n                                <attribute name='name' />\r\n                                <attribute name='fetchxml' />\r\n                                <attribute name='layoutxml' />\r\n                                <attribute name='returnedtypecode' />\r\n                                <filter type='and'>\r\n                                <filter type='or'>";var $enum1=ss.IEnumerator.getEnumerator($1);while($enum1.moveNext()){var $6=$enum1.current;$3+="<condition attribute='returnedtypecode' operator='eq' value='"+$6+"'/>";}$3+="\r\n                                    </filter>\r\n                                 <condition attribute='isquickfindquery' operator='eq' value='1'/>\r\n                                    <condition attribute='isdefault' operator='eq' value='1'/>\r\n                                </filter>\r\n                               \r\n                              </entity>\r\n                            </fetch>";var $4=Xrm.Sdk.OrganizationServiceProxy.retrieveMultiple($3);this.parser=new Client.MultiEntitySearch.ViewModels.QueryParser();var $5={};var $enum2=ss.IEnumerator.getEnumerator($4.get_entities());while($enum2.moveNext()){var $7=$enum2.current;$5[$7.getAttributeValueString('returnedtypecode')]=$7;}var $enum3=ss.IEnumerator.getEnumerator($2);while($enum3.moveNext()){var $8=$enum3.current;var $9=$5[$8];var $A=$9.getAttributeValueString('fetchxml');var $B=$9.getAttributeValueString('layoutxml');var $C=this.parser.parse($A,$B);$C.dataView=new SparkleXrm.GridEditor.EntityDataViewModel(10,Xrm.Sdk.Entity,true);this.config.push($C);}this.parser.queryDisplayNames();}
Client.MultiEntitySearch.ViewModels.MultiSearchViewModel.prototype={parser:null,getEntityDisplayName:function(index){var $0=this.config();if(index>=$0.length){return '';}else{return $0[index].rootEntity.displayCollectionName;}},searchCommand:function(){var $enum1=ss.IEnumerator.getEnumerator(this.config());while($enum1.moveNext()){var $0=$enum1.current;$0.dataView.set_fetchXml(this.parser.getFetchXmlForQuery($0,'%'+this.searchTerm()+'%'));$0.dataView.reset();$0.dataView.resetPaging();$0.dataView.refresh();}}}
Client.MultiEntitySearch.ViewModels.MultiSearchViewModel2013=function(){this.searchTerm=ko.observable();this.config=ko.observableArray();Client.MultiEntitySearch.ViewModels.MultiSearchViewModel2013.initializeBase(this);Xrm.Sdk.OrganizationServiceProxy.withCredentials=true;var $0=Xrm.PageEx.getWebResourceData();this.$1_5();var $1=this.$1_4();this.$1_0=new Client.MultiEntitySearch.ViewModels.QueryParser();var $enum1=ss.IEnumerator.getEnumerator(this.$1_2);while($enum1.moveNext()){var $2=$enum1.current;var $3=$1[$2];var $4=$3.getAttributeValueString('fetchxml');var $5=$3.getAttributeValueString('layoutxml');var $6=this.$1_0.parse($4,$5);$6.recordCount=ko.observable();$6.dataView=new SparkleXrm.GridEditor.VirtualPagedEntityDataViewModel(25,Xrm.Sdk.Entity,true);$6.recordCount(this.getResultLabel($6));this.config.push($6);$6.dataView.onPagingInfoChanged.subscribe(this.$1_3($6));}this.$1_0.queryDisplayNames();}
Client.MultiEntitySearch.ViewModels.MultiSearchViewModel2013.prototype={$1_0:null,$1_1:null,$1_2:null,$1_3:function($p0){return ss.Delegate.create(this,function($p1_0,$p1_1){
var $1_0=$p1_1;$p0.recordCount(this.getResultLabel($p0));});},$1_4:function(){var $0="<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>\r\n                              <entity name='savedquery'>\r\n                                <attribute name='name' />\r\n                                <attribute name='fetchxml' />\r\n                                <attribute name='layoutxml' />\r\n                                <attribute name='returnedtypecode' />\r\n                                <filter type='and'>\r\n                                <filter type='or'>";var $enum1=ss.IEnumerator.getEnumerator(Object.keys(this.$1_1));while($enum1.moveNext()){var $3=$enum1.current;$0+="<condition attribute='returnedtypecode' operator='eq' value='"+this.$1_1[$3].objectTypeCode.toString()+"'/>";}$0+="\r\n                                    </filter>\r\n                                 <condition attribute='isquickfindquery' operator='eq' value='1'/>\r\n                                    <condition attribute='isdefault' operator='eq' value='1'/>\r\n                                </filter>\r\n                               \r\n                              </entity>\r\n                            </fetch>";var $1=Xrm.Sdk.OrganizationServiceProxy.retrieveMultiple($0);var $2={};var $enum2=ss.IEnumerator.getEnumerator($1.get_entities());while($enum2.moveNext()){var $4=$enum2.current;$2[$4.getAttributeValueString('returnedtypecode')]=$4;}return $2;},$1_5:function(){Xrm.Sdk.OrganizationServiceProxy.registerExecuteMessageResponseType('ExecuteFetch',Client.MultiEntitySearch.ViewModels.ExecuteFetchResponse);var $0="<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>\r\n                                  <entity name='multientitysearchentities'>\r\n                                    <attribute name='entityname' />\r\n                                    <order attribute='entityorder' descending='false' />\r\n                                  </entity>\r\n                                </fetch>";var $1=new Client.MultiEntitySearch.ViewModels.ExecuteFetchRequest();$1.fetchXml=$0;var $2=Xrm.Sdk.OrganizationServiceProxy.execute($1);var $3=$($2.fetchXmlResult);this.$1_2=[];var $4=$3.first().find('result');$4.each(ss.Delegate.create(this,function($p1_0,$p1_1){
var $1_0=Xrm.Sdk.XmlHelper.selectSingleNodeValue($p1_1,'entityname');this.$1_2.add($1_0);}));var $5=new Xrm.Sdk.Metadata.Query.MetadataQueryBuilder();$5.addEntities(this.$1_2,['ObjectTypeCode','DisplayCollectionName']);$5.setLanguage(USER_LANGUAGE_CODE);var $6=Xrm.Sdk.OrganizationServiceProxy.execute($5.request);this.$1_1={};var $enum1=ss.IEnumerator.getEnumerator($6.entityMetadata);while($enum1.moveNext()){var $7=$enum1.current;this.$1_1[$7.logicalName]=$7;}},getResultLabel:function(config){var $0=this.$1_1[config.rootEntity.logicalName].displayCollectionName.userLocalizedLabel.label;var $1=config.dataView.getLength();return $0+'('+$1.toString()+')';},getEntityDisplayName:function(index){var $0=this.config();if(index>=$0.length){return '';}else{var $1=$0[index];var $2=$1.dataView.getLength();var $3=this.$1_1[$1.rootEntity.logicalName].displayCollectionName.userLocalizedLabel.label;return $3+'('+$2.toString()+')';}},searchCommand:function(){var $enum1=ss.IEnumerator.getEnumerator(this.config());while($enum1.moveNext()){var $0=$enum1.current;$0.dataView.resetPaging();$0.dataView.set_fetchXml(null);$0.dataView.get_data().clear();$0.dataView.refresh();$0.dataView.set_fetchXml(this.$1_0.getFetchXmlForQuery($0,'%'+this.searchTerm()+'%'));if($0.rootEntity.primaryImageAttribute!=null){var $1=$0.dataView.get_fetchXml().indexOf('<attribute ');$0.dataView.set_fetchXml($0.dataView.get_fetchXml().substr(0,$1)+'<attribute name="'+$0.rootEntity.primaryImageAttribute+"_url\" alias='card_image_url'/>"+$0.dataView.get_fetchXml().substr($1));}$0.dataView.reset();}}}
Client.MultiEntitySearch.ViewModels.QueryParser=function(){this.$0={};this.$1={};this.$2={};}
Client.MultiEntitySearch.ViewModels.QueryParser.prototype={parse:function(fetchXml,layoutXml){var $0={};$0.columns=[];var $1=$('<query>'+fetchXml.replaceAll('{0}','#Query#')+'</query>');var $2=$1.find('fetch');$0.fetchXml=$1;this.$4($0);$0.columns=this.$3($0.rootEntity,layoutXml);return $0;},$3:function($p0,$p1){var $0=$($p1);var $1=$0.find('cell');var $2=[];$1.each(ss.Delegate.create(this,function($p1_0,$p1_1){
var $1_0=$p1_1.getAttribute('name').toString();var $1_1=$1_0;var $1_2;var $1_3;var $1_4=$1_0.indexOf('.');if($1_4>-1){var $1_8=$1_0.substr(0,$1_4);$1_1=$1_0.substr($1_4+1);$1_2=this.$1[$1_8];}else{$1_2=$p0;}if(Object.keyExists($1_2.attributes,$1_1)){$1_3=$1_2.attributes[$1_1];}else{$1_3={};$1_3.columns=[];$1_3.logicalName=$1_1;$1_2.attributes[$1_3.logicalName]=$1_3;}var $1_5=parseInt($p1_1.getAttribute('width').toString());var $1_6=$p1_1.getAttribute('disableSorting');var $1_7=SparkleXrm.GridEditor.GridDataViewBinder.newColumn($1_3.logicalName,$1_3.logicalName,$1_5);$1_7.sortable=!($1_6!=null&&$1_6.toString()==='1');$1_3.columns.add($1_7);$2.add($1_7);}));return $2;},queryDisplayNames:function(){var $0=new Xrm.Sdk.Metadata.Query.MetadataQueryBuilder();var $1=[];var $2=[];var $enum1=ss.IEnumerator.getEnumerator(Object.keys(this.$0));while($enum1.moveNext()){var $4=$enum1.current;$1.add($4);var $5=this.$0[$4];var $enum2=ss.IEnumerator.getEnumerator(Object.keys($5.attributes));while($enum2.moveNext()){var $6=$enum2.current;var $7=$5.attributes[$6];var $8=$7.logicalName;var $9=$8.indexOf('.');if($5.aliasName!=null&&$9>-1){$8=$8.substr($9);}$2.add($8);}}$0.addEntities($1,['Attributes','DisplayName','DisplayCollectionName','PrimaryImageAttribute']);$0.addAttributes($2,['DisplayName','AttributeType','IsPrimaryName']);$0.setLanguage(USER_LANGUAGE_CODE);var $3=Xrm.Sdk.OrganizationServiceProxy.execute($0.request);var $enum3=ss.IEnumerator.getEnumerator($3.entityMetadata);while($enum3.moveNext()){var $A=$enum3.current;var $B=this.$0[$A.logicalName];$B.displayName=$A.displayName.userLocalizedLabel.label;$B.displayCollectionName=$A.displayCollectionName.userLocalizedLabel.label;$B.primaryImageAttribute=$A.primaryImageAttribute;var $enum4=ss.IEnumerator.getEnumerator($A.attributes);while($enum4.moveNext()){var $C=$enum4.current;if(Object.keyExists($B.attributes,$C.logicalName)){var $D=$B.attributes[$C.logicalName];$D.attributeType=$C.attributeType;switch($C.attributeType){case 'Lookup':case 'Picklist':case 'Customer':case 'Owner':case 'Status':case 'State':case 'Boolean':this.$2[$C.logicalName]=$D;break;}$D.isPrimaryName=$C.isPrimaryName;var $enum5=ss.IEnumerator.getEnumerator($D.columns);while($enum5.moveNext()){var $E=$enum5.current;$E.name=$C.displayName.userLocalizedLabel.label;$E.dataType=($C.isPrimaryName)?'PrimaryNameLookup':$C.attributeType;}}}}},$4:function($p0){var $0=$p0.fetchXml;var $1=$0.find('entity');var $2=$1.attr('name');var $3;if(!Object.keyExists(this.$0,$2)){$3={};$3.logicalName=$2;$3.attributes={};this.$0[$3.logicalName]=$3;}else{$3=this.$0[$2];}var $4=$1.find('link-entity');$4.each(ss.Delegate.create(this,function($p1_0,$p1_1){
var $1_0={};$1_0.attributes={};$1_0.aliasName=$p1_1.getAttribute('alias').toString();$1_0.logicalName=$p1_1.getAttribute('name').toString();if(!Object.keyExists(this.$0,$1_0.logicalName)){this.$0[$1_0.logicalName]=$1_0;}else{var $1_1=$1_0.aliasName;$1_0=this.$0[$1_0.logicalName];$1_0.aliasName=$1_1;}if(!Object.keyExists(this.$1,$1_0.aliasName)){this.$1[$1_0.aliasName]=$1_0;}}));$p0.rootEntity=$3;},getFetchXmlForQuery:function(config,searchTerm){var $0=config.fetchXml.find('fetch');$0.attr('count','{0}');$0.attr('paging-cookie','{1}');$0.attr('page','{2}');$0.attr('returntotalrecordcount','true');$0.attr('distinct','true');$0.attr('no-lock','true');var $1=$0.find('order');$1.remove();var $2=$0.find("filter[isquickfindfields='1']");$2.first().children().each(ss.Delegate.create(this,function($p1_0,$p1_1){
var $1_0=$p1_1.getAttribute('attribute').toString();if(Object.keyExists(this.$2,$1_0)){$p1_1.setAttribute('attribute',$1_0+'name');}}));var $3=config.fetchXml.html().replaceAll('</entity>','{3}</entity>');$3=$3.replaceAll('#Query#',Xrm.Sdk.XmlHelper.encode(searchTerm));return $3;}}
Type.registerNamespace('Client.MultiEntitySearch.Views');Client.MultiEntitySearch.Views.MultiSearchView=function(){}
Client.MultiEntitySearch.Views.MultiSearchView.init=function(){var $0=new Client.MultiEntitySearch.ViewModels.MultiSearchViewModel();Xrm.PageEx.majorVersion=2013;var $1=$0.config();var $2=0;var $enum1=ss.IEnumerator.getEnumerator($1);while($enum1.moveNext()){var $3=$enum1.current;var $4=new SparkleXrm.GridEditor.GridDataViewBinder();var $5=$4.dataBindXrmGrid($3.dataView,$3.columns,'grid'+$2.toString()+'container','grid'+$2.toString()+'pager',true,false);$4.bindClickHandler($5);$2++;}SparkleXrm.ViewBase.registerViewModel($0);}
Client.MultiEntitySearch.Views.MultiSearchView2013=function(){}
Client.MultiEntitySearch.Views.MultiSearchView2013.init=function(){var $0=new Client.MultiEntitySearch.ViewModels.MultiSearchViewModel2013();var $1=$0.config();var $2=0;var $enum1=ss.IEnumerator.getEnumerator($1);while($enum1.moveNext()){var $3=$enum1.current;var $4=[{id:'card-column',options:$3.columns,name:'Name',width:290,cssClass:'card-column-cell'}];$4[0].formatter=Client.MultiEntitySearch.Views.MultiSearchView2013.renderCardColumnCell;$4[0].dataType='PrimaryNameLookup';var $5=new SparkleXrm.GridEditor.GridDataViewBinder();var $6={};$6.enableCellNavigation=true;$6.autoEdit=false;$6.editable=false;$6.enableAddRow=false;var $7=$3.columns.length;$6.rowHeight=(($7>3)?3:$7)*16;if($6.rowHeight<70){$6.rowHeight=70;}$6.headerRowHeight=0;var $8='grid'+$2.toString()+'container';var $9=$3.dataView;var $A=new Slick.Grid('#'+$8,$9,$4,$6);Client.MultiEntitySearch.Views.MultiSearchView2013.$0($A,$8);$5.dataBindEvents($A,$9,$8);$5.bindClickHandler($A);$2++;}SparkleXrm.ViewBase.registerViewModel($0);}
Client.MultiEntitySearch.Views.MultiSearchView2013.$0=function($p0,$p1){$(window).resize(function($p1_0){
Client.MultiEntitySearch.Views.MultiSearchView2013.$1($p0,$p1);});$(function(){
Client.MultiEntitySearch.Views.MultiSearchView2013.$1($p0,$p1);});}
Client.MultiEntitySearch.Views.MultiSearchView2013.$1=function($p0,$p1){var $0=$(window).height();$('#'+$p1).height($0-60);$p0.resizeCanvas();}
Client.MultiEntitySearch.Views.MultiSearchView2013.renderCardColumnCell=function(row,cell,value,columnDef,dataContext){var $0=columnDef.options;var $1=dataContext;var $2='';var $3=true;var $4=$1.getAttributeValueString('card_image_url');var $5;if($4!=null){$5="<img class='entity-image' src='"+Xrm.Page.context.getClientUrl()+$4+"'/>";}else{var $7=$1.logicalName;if($7==='activitypointer'){var $8=$1.getAttributeValueString('activitytypecode');$7=$8;}$5="<div class='record_card "+$7+"_card'><img src='..\\..\\sparkle_\\css\\images\\transparent_spacer.gif'\\></dv>";}var $6=0;$2="<table class='contact-card-layout'><tr><td>"+$5+'</td><td>';var $enum1=ss.IEnumerator.getEnumerator($0);while($enum1.moveNext()){var $9=$enum1.current;if($9.field!=='activitytypecode'){var $A=$1.getAttributeValue($9.field);var $B=$9.formatter(row,cell,$A,$9,dataContext);$2+='<div '+(($3)?"class='first-row'":'')+" tooltip='"+$A+"'>"+$B+'</div>';$3=false;$6++;}if($6>3){break;}}$2+='</tr></table>';return $2;}
SparkleXrm.GridEditor.VirtualPagedEntityDataViewModel.registerClass('SparkleXrm.GridEditor.VirtualPagedEntityDataViewModel',SparkleXrm.GridEditor.EntityDataViewModel);Client.MultiEntitySearch.ViewModels.ExecuteFetchRequest.registerClass('Client.MultiEntitySearch.ViewModels.ExecuteFetchRequest',null,Object);Client.MultiEntitySearch.ViewModels.ExecuteFetchResponse.registerClass('Client.MultiEntitySearch.ViewModels.ExecuteFetchResponse',null,Object);Client.MultiEntitySearch.ViewModels.MultiSearchViewModel.registerClass('Client.MultiEntitySearch.ViewModels.MultiSearchViewModel',SparkleXrm.ViewModelBase);Client.MultiEntitySearch.ViewModels.MultiSearchViewModel2013.registerClass('Client.MultiEntitySearch.ViewModels.MultiSearchViewModel2013',SparkleXrm.ViewModelBase);Client.MultiEntitySearch.ViewModels.QueryParser.registerClass('Client.MultiEntitySearch.ViewModels.QueryParser');Client.MultiEntitySearch.Views.MultiSearchView.registerClass('Client.MultiEntitySearch.Views.MultiSearchView');Client.MultiEntitySearch.Views.MultiSearchView2013.registerClass('Client.MultiEntitySearch.Views.MultiSearchView2013');})(window.xrmjQuery);});function waitForScripts(name,scriptNames,callback){var hasLoaded=false;window._loadedScripts=window._loadedScripts||[];function checkScripts(){var allLoaded=true;for(var i=0;i<scriptNames.length;i++){var hasLoaded=true;var script=scriptNames[i];switch(script){case"mscorlib":hasLoaded=typeof(window.ss)!="undefined";break;case"jquery":hasLoaded=typeof(window.xrmjQuery)!="undefined";break;case"jquery-ui":hasLoaded=typeof(window.xrmjQuery.ui)!="undefined";break;default:hasLoaded=window._loadedScripts[script];break;} allLoaded=allLoaded&&hasLoaded;if(!allLoaded){setTimeout(checkScripts,10);break;}} if(allLoaded){callback();window._loadedScripts[name]=true;}} checkScripts();}