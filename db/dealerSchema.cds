namespace DealerDb;

using {
  managed,} from '@sap/cds/common';

entity Retailer :managed {
  key RetailerId  : String;
  key TaxNo       : String; 
      Name        : String;
      Email       : String; 
      ContactNo   : String; 
      Street      : String;
      District    : String;
      City        : String;
      Country     : String; 
      PostalCode  : String; 
      DealerID    : String;
     
}
