using {DealerDb} from '../db/dealerSchema';
using {QrGeneratorApp_edmx} from './external/QrGeneratorApp.edmx';
using ZTRACKTRACE_VALUEHELP_SRV from './external/ZTRACKTRACE_VALUEHELP_SRV.cds';
using ZTRACK_TRACE_SRV from './external/ZTRACK_TRACE_SRV.cds';



service dealerService {

    action   MapRetailer(OC_OCID : String, IC_ICID : String, RetailerId : String, TaxNo : String ,SerialNo:String) returns String;

    // function to fetch OCID on the basis of vendor in dealer dashboard screen
    function getDealerDashOCValueHelp(DealerId : String)                                          returns array of {
        OCID : String;
    };

    function getDealerOcIcBoxMappingdata(ICID : String, OCID : String,SerialNo:String)                          returns array of {
        OCID : String;
        ICID : String;
        SerialNo:String;
        ProductionOrder : Int64;
        BatchID : String(50);
        ManufactureDt : DateTime;
        ExpiryDt : DateTime;
        Qunatity : Int64;
        RetailerID : String;
        RetailerTaxNo : String;
        RetailerName : String;

    };
     function getProductionTrackingDashboardData(OCID : String)           returns array of {
        OCID : String;
        OCQRCode : String;
        OCQRCodeURL : String;
        BatchID : String;
        status : String;
        VendorId : String;
        VendorName : String;
        ManufactureDt : DateTime;
        ExpiryDt : DateTime;
        ProductionOrder : Int64;
        Material : String;
        ICs : array of {
            ICID : String;
            ICQRCode : String;
            ICQRCodeURL : String;
            Boxes : array of {
                SerialNo : String;
                BoxQRCode : String;
                BoxQRCodeURL : String;
            };
        };
    };


    function getOCValueHelpforRetailerMapping(DealerId : String,SelectionType:String)                                          returns array of {
        OCID : String;
    };
     entity zbatchdetails_Track         as
        projection on ZTRACK_TRACE_SRV.zbatchdetails_Track {
            key BatchNo,
            key SerialNo,
                Material,
                aufnr,
                ManufactureDt,
                ExpiryDt,
                ProductionOrder,
                OrderList
        };
    entity Retailer          as projection on DealerDb.Retailer;
    entity MaterialBox       as projection on QrGeneratorApp_edmx.MaterialBox;
    entity InnerContainer    as projection on QrGeneratorApp_edmx.InnerContainer;
    entity OuterContainer    as projection on QrGeneratorApp_edmx.OuterContainer;

    entity zcustomer_sotrack as
        projection on ZTRACKTRACE_VALUEHELP_SRV.zcustomer_sotrack {
            key Kunnr,
                Description
        };

}
