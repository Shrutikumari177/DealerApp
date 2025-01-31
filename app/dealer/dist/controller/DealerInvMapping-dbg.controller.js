
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "com/ingenx/dealer/utils/HelperFunction",
    "sap/m/MessageBox",
], (BaseController, Filter, FilterOperator, Fragment, JSONModel, HelperFunction, MessageBox) => {
    "use strict";
    let dealerID;
    let userEmail;
    let userID;
    return BaseController.extend("com.ingenx.dealer.controller.DealerInvMapping", {

        onInit() {
            this.getLoggedInUserInfo();
        },
    
        // extract logged in user info 
        getLoggedInUserInfo: async function () {
            try {
                let User = await sap.ushell.Container.getService("UserInfo");
                userID = User.getId();
                userEmail = User.getEmail();
                let userFullName = User.getFullName();
                console.log("userEmail", userEmail);
                console.log("userFullName", userFullName);
                console.log("userID", userID);
                this.checkforValidUser();
            } catch (error) {
                userEmail = undefined;
                console.log("hiii", userEmail);
            }
        },

        // check validate logged-in user 
        checkforValidUser: async function () {
            let loggedinUser = userEmail;
            if (loggedinUser === "DEFAULT_USER") {
                dealerID = "1100000003";
                console.log("dealer found for Shruti Kumari",dealerID);
                return dealerID;
            } else if (loggedinUser === "rishabh.tiwari@ingenxtec.com") {
                dealerID = "100010";
                console.log("dealer found for Rishbh Tiwari", dealerID);
                return dealerID;
            } else {
                console.log("No dealer found for the logged-in user");
                return null;
            }
        },

        // use for change in Select Box according to bOX,IC,Box    
        onSelectChange:async function (oEvent) {
            var sSelectedKey = oEvent.getSource().getSelectedKey();
            this._selectedKey = sSelectedKey;
            let sKey = ""
             if(this._selectedKey === "OC"){
                  sKey = "OuterContainer"
             } 
             else if(this._selectedKey === "IC"){
                  sKey = "InnerContainer"
             }
             else{
                sKey = "Box"
             }
             let url = `getOCValueHelpforRetailerMapping?DealerId='1100000003'&SelectionType='${sKey}'`
             let oModel = this.getOwnerComponent().getModel()
             let oBindList = oModel.bindList(`/${url}`)
             try {
              let oContext =await oBindList.requestContexts(0,Infinity)
              let oData = oContext.map(context=>context.getObject())
              console.log("selected data",oData)
              let itemModel = new JSONModel(oData)
              this.getView().setModel(itemModel,"allSelectedItemModel")
             } catch (error) {
              console.warn(error)
             }
             this.onVisibleFields([
                {id:"mapping_ocValueHelpInput",bValue:false},
                {id:"invMapping_LabelOC",bValue:false},
                {id:"mapping_IcValueHelpInput",bValue:false},
                {id:"invMapping_LabelIC",bValue:false},
                {id:"mapping_BOXValueHelpInput",bValue:false},
                {id:"invMapping_LabelBOX",bValue:false},
                {id:"invMapping_BlockLayoutCellOC",bValue:false},
                {id:"invMapping_BlockLayoutCellIC",bValue:false},
                {id:"invMapping_BlockLayoutCellBOX",bValue:false},    
            ])
            switch (sSelectedKey) {
                case "OC":
                    this.onVisibleFields([
                        {id:"mapping_ocValueHelpInput",bValue:true},
                        {id:"invMapping_LabelOC",bValue:true},
                        {id:"invMapping_BlockLayoutCellOC",bValue:true},  
                    ])
                    break;
                case "IC":
                    this.onVisibleFields([
                        {id:"mapping_IcValueHelpInput",bValue:true},
                        {id:"invMapping_LabelIC",bValue:true},
                        {id:"invMapping_BlockLayoutCellIC",bValue:true},  
                    ])
                    break;
                case "BOX":
                    this.onVisibleFields([
                        {id:"mapping_BOXValueHelpInput",bValue:true},
                        {id:"invMapping_LabelBOX",bValue:true},
                        {id:"invMapping_BlockLayoutCellBOX",bValue:true},  
                    ])
                    break;
                default:
                    break;
            }
            this.refreshUiFields();
        },

        onVisibleFields : function(inputIDs){
            if(Array.isArray(inputIDs)){
                inputIDs.forEach(itemID=>{
                    let id = this.getView().byId(itemID?.id)
                    if(id){
                        id.setVisible(itemID.bValue)
                    }
                    else{
                        console.log(`${id} not Found`)
                    }
                })
            }
            else{
                console.log("ID is not a Array")
            }
        },

        onBoxValueHelp: function(){
            HelperFunction._openValueHelpDialog(this, "ocBoxValueHelp", "com.ingenx.dealer.fragments.boxValueHelp");
        },


        onOCValueHelp: async function () {
                HelperFunction._openValueHelpDialog(this, "ocRetailerValueHelp", "com.ingenx.dealer.fragments.ocRetailerValueHelp");
        },
        
        onOCValueHelpSearch: function (oEvent) {
            HelperFunction._valueHelpLiveSearch(oEvent, "OCID")
        },

        onOCOCValueConfirmItem: async function (oEvent) {
            HelperFunction._valueHelpSelectedValue(oEvent, this, "mapping_ocValueHelpInput");
        },
        onBoxValueConfirmItem: async function (oEvent) {
            HelperFunction._valueHelpSelectedValue(oEvent, this, "mapping_BOXValueHelpInput");
        },

        // function execute when oc container is triggered
        onOCValueConfirmItemtrigger: async function () {
            let OCID = this.getView().byId("mapping_ocValueHelpInput").getValue();
            try {
                let oData =await HelperFunction._getSingleEntityDataWithParam(this,"getDealerOcIcBoxMappingdata","OCID",OCID)
                console.log("oData", oData);
                let filteredDataModel = this.getOwnerComponent().getModel("filteredDataModel");
                if (!filteredDataModel) {
                    filteredDataModel = new sap.ui.model.json.JSONModel();
                    this.getOwnerComponent().setModel(filteredDataModel, "filteredDataModel");
                }
                filteredDataModel.setData(oData[0]);
                console.log("Data set in filteredDataModel:", filteredDataModel.getData());
                let retailerID = oData.length > 0 ? oData[0].RetailerID : null;
                let retailerInput = this.getView().byId("mapping_retailerValueHelpInput");
                let submitButton = this.getView().byId("invMapping_ButtonOC");
                if (retailerID) {
                    retailerInput.setEditable(false);
                    submitButton.setVisible(false);
                } else {
                    retailerInput.setEditable(true);
                    submitButton.setVisible(true);
                }
            } catch (oError) {
                console.error("Error fetching filtered data:", oError);
            }
        },

        onICValueHelp: async function () {
                HelperFunction._openValueHelpDialog(this, "icRetailerValueHelp", "com.ingenx.dealer.fragments.icRetailerValueHelp");
        },

        onICValueHelpSearch: function (oEvent) {
            HelperFunction._valueHelpLiveSearch(oEvent, "ICID")
        },
        
        onICValueConfirmItem: async function (oEvent) {
            HelperFunction._valueHelpSelectedValue(oEvent, this, "mapping_IcValueHelpInput");

        },
        onICValueConfirmItemtrigger: async function () {
            let ICID = this.getView().byId("mapping_IcValueHelpInput").getValue();
            try {
                let oData =await HelperFunction._getSingleEntityDataWithParam(this,"getDealerOcIcBoxMappingdata","ICID",ICID)
                console.log("oData", oData);
                let filteredDataModel = this.getOwnerComponent().getModel("filteredDataModel");
                if (!filteredDataModel) {
                    filteredDataModel = new sap.ui.model.json.JSONModel();
                    this.getOwnerComponent().setModel(filteredDataModel, "filteredDataModel");
                }
                filteredDataModel.setData(oData[0]);
                let retailerID = oData.length > 0 ? oData[0].RetailerID : null;
                let retailerInput = this.getView().byId("invMapping_retailerValueHelpInput");
                let submitButton = this.getView().byId("invMapping_ButtonIC");
                if (retailerID) {
                    retailerInput.setEditable(false);
                    submitButton.setVisible(false);
                } else {
                    retailerInput.setEditable(true);
                    submitButton.setVisible(true);
                }
            } catch (oError) {
                console.error("Error fetching filtered data:", oError);
                MessageBox.error("Failed to fetch filtered data. Please try again.");
            }
        },

        onBOXValueConfirmItemtrigger: async function () {
            let boxId = this.getView().byId("mapping_BOXValueHelpInput").getValue();
            try {
                let oData =await HelperFunction._getSingleEntityDataWithParam(this,"getDealerOcIcBoxMappingdata","SerialNo",boxId)
                console.log("oData", oData);
                let filteredDataModel = this.getOwnerComponent().getModel("filteredDataModel");
                if (!filteredDataModel) {
                    filteredDataModel = new sap.ui.model.json.JSONModel();
                    this.getOwnerComponent().setModel(filteredDataModel, "filteredDataModel");
                }
                filteredDataModel.setData(oData[0]);
                console.log("Data set in filteredDataModel:", filteredDataModel.getData());
                let retailerID = oData.length > 0 ? oData[0].RetailerID : null;
                let retailerInput = this.getView().byId("invMapping_retailerValueHelpInput");
                let submitButton = this.getView().byId("invMapping_ButtonIC");
                if (retailerID) {
                    retailerInput.setEditable(false);
                    submitButton.setVisible(false);
                } else {
                    retailerInput.setEditable(true);
                    submitButton.setVisible(true);
                }
            } catch (oError) {
                console.error("Error fetching filtered data:", oError);
            }
        },

      _onMappingGoButtonPress: function () {
            switch (this._selectedKey) {
                case "OC":
                    this.onOCValueConfirmItemtrigger();
                    break;
                case "IC":
                    this.onICValueConfirmItemtrigger();
                    break;
                case "BOX":
                    this.onBOXValueConfirmItemtrigger();
                    break;
                default:
                    console.warn("No valid selection made.");
                    break;
            }
        },

        _onOpenReatilerValueHelp: function () {
            HelperFunction._openValueHelpDialog(this, "RetailerValueHelp", "com.ingenx.dealer.fragments.retailerValueHelp")

        },
        onRetailerValueHelpSearch: function (oEvent) {
            HelperFunction._valueHelpLiveSearch(oEvent, "RetailerId")
        },

        onRetailerValueConfirmItem: async function (oEvent) {
            try {
                let oSelectedItem = oEvent.getParameter("selectedItem");
                if (!oSelectedItem) {
                    throw new Error("No item selected.");
                }
                let oContext = oSelectedItem.getBindingContext();
                if (!oContext) {
                    throw new Error("Binding context not found.");
                }
                let retailerId = oContext.getProperty("RetailerId");
                let retailerName = oContext.getProperty("Name");
                let TaxNo = oContext.getProperty("TaxNo");
                this.getView().byId("mapping_retailerNameInput").setValue(retailerName);
                this.getView().byId("retailerTaxField").setValue(TaxNo);
                this.getView().byId("mapping_retailerValueHelpInput").setValue(retailerId);
                HelperFunction._valueHelpSelectedValue(oEvent, this, "mapping_retailerValueHelpInput");
            } catch (error) {
                console.error("Error in onRetailerValueConfirmItem:", error.message);
                sap.m.MessageBox.error("An error occurred while selecting a retailer: " + error.message);
            }
        },

        refreshUiFields: function () {
            let oModel = this.getView().getModel("filteredDataModel");
            if (oModel) {
                oModel.setData({});
                oModel.refresh(true);
            } else {
                console.warn("The filteredDataModel is not defined.");
            }
        },

        onSubmitMappingData: function () {
            try {
                debugger
                let inputValues = HelperFunction._getInputValues(this,["mapping_ocValueHelpInput","mapping_IcValueHelpInput","mapping_BOXValueHelpInput","mapping_retailerValueHelpInput","retailerTaxField"])
                let [OCID,ICID,Box,RetailerId,TaxNo] = inputValues
                if (!OCID && !ICID && !Box) {
                    throw new Error("Neither OCID nor ICID is provided.");
                }
                if (ICID) {
                    let payloadforInvMapping = {
                        IC_ICID: ICID,
                        RetailerId: RetailerId,
                        TaxNo: TaxNo
                    };
                    console.log("Payload for IC:", payloadforInvMapping);
                    this._sendToBackendOC(payloadforInvMapping);
                }
                if (OCID) {
                    let payloadforInvMapping = {
                        OC_OCID: OCID,
                        RetailerId: RetailerId,
                        TaxNo: TaxNo
                    };
                    console.log("Payload for OC:", payloadforInvMapping);
                    this._sendToBackendOC(payloadforInvMapping);
                }
                if (Box) {
                    let payloadforInvMapping = {
                        SerialNo: Box,
                        RetailerId: RetailerId,
                        TaxNo: TaxNo
                    };
                    console.log("Payload for OC:", payloadforInvMapping);
                    this._sendToBackendOC(payloadforInvMapping);
                }
                
        
            } catch (error) {
                console.error("Error in onSubmitMappingData:", error.message);
                sap.m.MessageBox.error(error.message);
            }
        },

      
        _sendToBackendOC: async function (payloadforInvMapping) {
            try {
                console.log("Sending payload to backend:", payloadforInvMapping);
        
                var oModel = this.getOwnerComponent().getModel();
                if (!oModel) {
                    throw new Error("OData V4 model not found.");
                }
        
                let sAction = "/MapRetailer(...)";
        
                const oContext = oModel.bindContext(sAction, undefined);
        
                if (payloadforInvMapping.OC_OCID) {
                    oContext.setParameter("OC_OCID", payloadforInvMapping.OC_OCID);
                }
                if (payloadforInvMapping.IC_ICID) {
                    oContext.setParameter("IC_ICID", payloadforInvMapping.IC_ICID);
                }
                if (payloadforInvMapping.SerialNo) {
                    oContext.setParameter("SerialNo", payloadforInvMapping.SerialNo);
                }
                if (payloadforInvMapping.RetailerId) {
                    oContext.setParameter("RetailerId", payloadforInvMapping.RetailerId);
                }
                if (payloadforInvMapping.TaxNo) {
                    oContext.setParameter("TaxNo", payloadforInvMapping.TaxNo);
                }
        
                await oContext.execute();
        
                console.log("Mapping Done successfully:");
                sap.m.MessageToast.show("Action executed successfully!");
        
            } catch (error) {
                console.error("Error executing action:", error);
                sap.m.MessageBox.error( error.message);
            }
        }
        
        
        
      
        
        
        
        
    });
});