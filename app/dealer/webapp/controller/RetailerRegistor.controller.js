sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "com/ingenx/dealer/utils/HelperFunction"
  ], (BaseController,MessageBox,HelperFunction) => {
    "use strict";
  
    return BaseController.extend("com.ingenx.dealer.controller.RetailerRegistor", {
        onInit() {
                 
        },
    
      onSubmitRetailerDetailsData: async function () {
        debugger
        let inputFieldIds = [
            "registrationMapping_retailerName",
            "registrationMapping_emailID",
            "registrationMapping_contactNo",
            "registrationMapping_gstNo", // This corresponds to TaxNo 
            "registrationMapping_street",
            "registrationMapping_district",
            "registrationMapping_city",
            "registrationmapping_country",
            "registrationmapping_postalCode"
        ];  
    
        let inputValues = await HelperFunction._getInputValues(this,inputFieldIds);
        let [Retailer_Name, Email_ID, Contact_No, GST_No, Street, District, City, Country, Postal_Code] = inputValues;

        let oPayload = {
            "Name": Retailer_Name || "",
            "Email": Email_ID || "",
            "ContactNo": Contact_No || "",
            "TaxNo": GST_No || "", // Saving GSTNo value as TaxNo
            "Street": Street || "",
            "District": District || "",
            "City": City || "",
            "Country": Country || "",
            "PostalCode": Postal_Code || "",
            "DealerID": "1"
        };
        let oModel = this.getOwnerComponent().getModel();
        try {
            let oBindList = oModel.bindList("/Retailer");
            oBindList.create(oPayload, true);
            oBindList.attachCreateCompleted((oEvent) => {
                let params = oEvent.getParameters();
                if (params.success) {
                    let response = params.context.getObject();
                    console.log("data", response);
                    let retailerIdValue = response.RetailerId;
                    sap.m.MessageBox.success("Retailer ID: " + retailerIdValue, {
                        title: "Retailer Registered Successfully",
                        onClose: () => {
                            HelperFunction._clearInputValues(this,inputFieldIds);
                        }
                    });
                }
            });
        } catch (error) {
            console.error("Error:", error);
        }
    },
       
       
    });
  });