/* checksum : 1a61217a7626e6d1d9be25f9d1474f35 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service ZTRACK_TRACE_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'track batch details'
entity ZTRACK_TRACE_SRV.zbatchdetails_Track {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Batch'
  @sap.quickinfo : 'Batch Number'
  key BatchNo : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Serial Number'
  key SerialNo : String(18) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  Material : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order'
  @sap.quickinfo : 'Order Number'
  aufnr : String(12);
  @sap.display.format : 'Date'
  @sap.label : 'Date of Manufacture'
  ManufactureDt : Date;
  @sap.display.format : 'Date'
  @sap.label : 'SLED/BBD'
  @sap.quickinfo : 'Shelf Life Expiration or Best-Before Date'
  ExpiryDt : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order'
  @sap.quickinfo : 'Order Number'
  ProductionOrder : String(12);
  @sap.label : 'Object list'
  @sap.quickinfo : 'Object list number'
  OrderList : Integer64;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Batch For Material in TrackTrace'
entity ZTRACK_TRACE_SRV.zbatchmaterial_Track {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order'
  @sap.quickinfo : 'Order Number'
  key ProductionOrder : String(12) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Material : String(40) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  Plant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Storage location'
  StorageLoc : String(4);
  @sap.label : 'Base Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  uom : String(3);
  @sap.unit : 'uom'
  @sap.label : 'Requirement Quantity'
  Reqnt : Decimal(13, 3);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Item no.'
  @sap.quickinfo : 'Item Number of Reservation / Dependent Requirements'
  ItemResv : String(4);
  Batch : String(10);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'batchno track'
entity ZTRACK_TRACE_SRV.zbatchno_track {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Batch'
  @sap.quickinfo : 'Batch Number'
  key BatchNo : String(10) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'track ordertype'
entity ZTRACK_TRACE_SRV.zorderType_Track {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  key Plant : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order Type'
  OrderType : String(4);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'plant value help'
entity ZTRACK_TRACE_SRV.zplant_trackvalue {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  key Plant : String(4) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'production order in Track and Trace'
entity ZTRACK_TRACE_SRV.ZProductionOrder_track {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order'
  @sap.quickinfo : 'Order Number'
  key ProductionOrder : String(12) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'material for track'
entity ZTRACK_TRACE_SRV.ztrack_material {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Material : String(40) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material type'
  MaterialType : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material description'
  @sap.quickinfo : 'Material Description in Uppercase for Matchcodes'
  MaterialDesc : String(40);
};

