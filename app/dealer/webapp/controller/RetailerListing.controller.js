sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "com/ingenx/dealer/utils/HelperFunction"
], function (Controller, MessageToast, Fragment, JSONModel, MessageBox,HelperFunction) {
    "use strict";
    let formattedDate;
    return Controller.extend("com.ingenx.dealer.controller.RetailerListing", {
        onInit:  function () {
           
        },

        dealerValueHelp: function () {
           HelperFunction._openValueHelpDialog(this,"dealerValueHelpValueHelp","com.ingenx.dealer.fragments.dealer")
        },

        onDealerValueHelpSearch: function (oEvent) {
            HelperFunction._valueHelpLiveSearch(oEvent,"Kunnr")
        },
    
        onDealerVendorValueConfirmItem: function (oEvent) {
            
            try {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    var sSelectedOrderType = oSelectedItem.getTitle();
                    this.getView().byId("retailerListing_DealerInput").setValue(sSelectedOrderType);
        
                    var oModel = this.getView().getModel();
                    var sFilterPath = "/Retailer";
                    var oFilter = new sap.ui.model.Filter("DealerID", sap.ui.model.FilterOperator.EQ, sSelectedOrderType);
        
                    oModel.bindList(sFilterPath, undefined, undefined, [oFilter]).requestContexts()
                        .then(function (aContexts) {
                            var aData = aContexts.map(function (oContext) {
                                return oContext.getObject();
                            });
        
                            var oJSONModel = new sap.ui.model.json.JSONModel(aData);
                            this.getView().setModel(oJSONModel, "filteredComponents");
                            console.log("Filtered Data:", aData);
                        }.bind(this))
                        .catch(function (oError) {
                            console.error("Error fetching data:", oError);
                            sap.m.MessageToast.show("Failed to fetch filtered data.");
                        });
                }
                oEvent.getSource().getBinding("items").filter([]);
            } catch (error) {
                console.error("Error in onproductionOrderValueHelpConfirm:", error);
                sap.m.MessageToast.show("Failed to process production order selection.");
            }
        },
    });
});