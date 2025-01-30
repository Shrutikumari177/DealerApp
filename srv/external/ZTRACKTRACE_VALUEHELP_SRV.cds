/* checksum : 5682db42e77b0a89f5c090061fdf0499 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service ZTRACKTRACE_VALUEHELP_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'customer valuehelp'
entity ZTRACKTRACE_VALUEHELP_SRV.zcustomer_sotrack {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer'
  @sap.quickinfo : 'Customer Number'
  key Kunnr : String(10) not null;
  @sap.label : 'Name'
  @sap.quickinfo : 'Name 1'
  Description : String(35);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Dist channel Valehelp'
entity ZTRACKTRACE_VALUEHELP_SRV.zdistchannel_sotrack {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Distribution Channel'
  key DistChannel : String(2) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Division valuehelp'
entity ZTRACKTRACE_VALUEHELP_SRV.Zdivision_sotrack {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Division'
  key Division : String(2) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Material Value Help'
entity ZTRACKTRACE_VALUEHELP_SRV.ZMaterial_ValueHelp {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Material : String(40) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'new org'
entity ZTRACKTRACE_VALUEHELP_SRV.zneworg {
  @sap.label : 'Language Key'
  key Spras : String(2) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales document type'
  @sap.quickinfo : 'Sales document type (not converted)'
  key Auart : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Language key'
  @sap.quickinfo : 'Language key for sales document type'
  AuartSpr : String(4);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'value help for plant'
entity ZTRACKTRACE_VALUEHELP_SRV.zplant_soTrack {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Storage Location'
  @sap.quickinfo : 'Storage location'
  key StorageLocation : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  key Plant : String(4) not null;
  @sap.label : 'Description'
  @sap.quickinfo : 'Description of Storage Location'
  Description : String(16);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Detail of sales order for so'
entity ZTRACKTRACE_VALUEHELP_SRV.zsalesorderdetails_so {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Language key'
  @sap.quickinfo : 'Language key for sales document type'
  key SalesOrderType : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Organization'
  key SalesOrg : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Distribution Channel'
  key DistChannel : String(2) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Division'
  key Division : String(2) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Document Type'
  key Auart : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Screen sequence grp.'
  @sap.quickinfo : 'Screen sequence group for document header & item'
  Kopgr : String(4);
  to_ta : Association to many ZTRACKTRACE_VALUEHELP_SRV.zneworg {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'sales order valuehelp'
entity ZTRACKTRACE_VALUEHELP_SRV.zsalesorder_trackso {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales document'
  @sap.quickinfo : 'Sales Document'
  key SalesOrder : String(10) not null;
  @sap.label : 'Description'
  @sap.quickinfo : 'Search term for product proposal'
  Description : String(40);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'salesorg valuehelp'
entity ZTRACKTRACE_VALUEHELP_SRV.zsalesorg_track {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Organization'
  key SalesOrg : String(4) not null;
};

