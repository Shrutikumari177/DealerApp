sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    let Dealer;
    let  userEmail;

    return Controller.extend("com.ingenx.dealer.controller.DealerDashboard", {
        onInit: async function () {
            await  this.getLoggedInUserInfo(); 
            Dealer = await  this.checkforValidUser();
            this.getDealerOc(Dealer);

            let isDisplayOrEdit = {
                isDisplay : true,
                isHide : false
            }
            let oModel = new sap.ui.model.json.JSONModel(isDisplayOrEdit)
            this.getView().setModel(oModel,"isDisplayModel")      
        },

        // get logged in user
        getLoggedInUserInfo : async function(){
            try {
              let User = await sap.ushell.Container.getService("UserInfo");
              let userID = User.getId();
              userEmail = User.getEmail();
              let userFullName = User.getFullName();
              console.log("userEmail", userEmail);
              console.log("userFullName", userFullName);
              console.log("userID", userID);
            } catch (error) {
              userEmail ="shruti.kumari@ingenxtec.com";
              console.log("hiii",userEmail);
            }
          },
        
        //   check validate user
        checkforValidUser: async function() {
            let loggedinUser = userEmail; 
        
            if (loggedinUser === "shruti.kumari@ingenxtec.com") {
                let DealerFound = "1100000003";
              
                return DealerFound;
            } else if (loggedinUser === "ashwani.sharma@ingenxtec.com") {
                let DealerFound = "21000001";
              
                return DealerFound;
            } else {
                console.log("No vendor found for the logged-in user");
                return null; 
            }
        },
      
        // used to filter the dealer's oc data based on dealer id
        getDealerOc: async function() {
            const oModel = this.getOwnerComponent().getModel();
            const oBindList = oModel.bindList(`/getDealerDashOCValueHelp(DealerId='${Dealer}')`);
            const aBatchIdData = [];
            try {
                const aContexts = await oBindList.requestContexts();
                aContexts.forEach((oContext) => {
                    aBatchIdData.push(oContext.getObject());
                });
            } catch (error) {
                throw new Error("Error fetching batch details: " + error.message);
            }
            console.log("Fetched Data:", aBatchIdData);
            const oDataModel = new sap.ui.model.json.JSONModel();
            oDataModel.setData({ OCData: aBatchIdData });
            this.getOwnerComponent().setModel(oDataModel, "OCModel");
            return aBatchIdData;
        },


        onSelectContract: async function (oEvent) {
            try {
                var oSelectedItem = oEvent.getSource();
                var oBindingContext = oSelectedItem.getBindingContext("OCModel"); 
                if (!oBindingContext) {
                    console.error("Binding context is undefined");
                    return;
                }
                var sOCID = oBindingContext.getProperty("OCID");
                console.log("Selected OCID:", sOCID);
                let oModel = this.getOwnerComponent().getModel();
                let sPath = `/getProductionTrackingDashboardData(OCID='${sOCID}')`;
                const oBindinggetCust = oModel.bindContext(sPath, null, {});
                const oData = await oBindinggetCust.requestObject();
                let allOCIDData = oData.value[0];
                let pOrder = allOCIDData.ProductionOrder;
                let mfgDate = allOCIDData.ManufactureDt;
                let expDate = allOCIDData.ExpiryDt;
                let BatchID = allOCIDData.BatchID;
                let Material = allOCIDData.Material
                console.table("oNewModel", allOCIDData);
                const result = allOCIDData.ICs.flatMap(ic => {
                    return ic.Boxes.map(box => ({
                        ICID: ic.ICID,
                        ICQRCode: ic.ICQRCode,
                        ICQRCodeUrl: ic.ICQRCodeURL,
                        BoxSerialNo: box.SerialNo,
                        BoxQRCode: box.BoxQRCode,
                        BoxQRCodeUrl: box.BoxQRCodeURL,
                        pOrder,
                        mfgDate,
                        expDate,
                        BatchID,
                        Material
                    }));
                });
                var oNewModel1 = new sap.ui.model.json.JSONModel();
                oNewModel1.setData(result);
                console.log("result update data",result)
                this.getView().setModel(oNewModel1, "newArrayModel");
                var oNewModel = new sap.ui.model.json.JSONModel();
                oNewModel.setData(allOCIDData);
                this.getView().setModel(oNewModel, "newModel");
            } catch (oError) {
                console.error("Error fetching data:", oError);
            }
        },

        lengthFormatter: function(value){
          if(Array.isArray(value)){
            return value.length
          }
          return 0
        },

        boxLengthFormatter:function(ICs){
           if(Array.isArray(ICs)){
             let ICBox =  ICs.map(item=>item.Boxes)
             let BoxLength = ICBox.flat()
             return BoxLength.length
           }
           return 0
        },

        onScanSuccess: function (oEvent) {
            if (oEvent.getParameter("cancelled")) {
              MessageToast.show("Scan cancelled", { duration: 1000 });
            } else {
              var scanResult = oEvent.getParameter("text");
              if (scanResult) {    
                var scannedData = JSON.parse(scanResult);  
                let pOrder = scannedData.ProductionOrder;
                let mfgDate = scannedData.ManufactureDt;
                let expDate = scannedData.ExpiryDt;
                let BatchID = scannedData.BatchID;
                let Material = scannedData.Material 
                const result = scannedData.ICs.flatMap(ic => {
                    return ic.Boxes.map(box => ({
                        ICID: ic.ICID,
                        ICQRCode: ic.ICQRCode,
                        ICQRCodeUrl: ic.ICQRCodeURL,
                        BoxSerialNo: box.SerialNo,
                        BoxQRCode: box.BoxQRCode,
                        BoxQRCodeUrl: box.BoxQRCodeURL,
                        pOrder,
                        mfgDate,
                        expDate,
                        BatchID,
                        Material
                    }));
                });
                let extractIcDataModel = new sap.ui.model.json.JSONModel(result)
                this.getView().setModel(extractIcDataModel,"ICScannerDataModel")
                let displayModel  = this.getView().getModel("isDisplayModel")
                displayModel.setProperty("/isHide",true)
                displayModel.setProperty("/isDisplay",false)
                console.log("bar code data data",this.getView().getModel("ICScannerDataModel").getData())
                let oModel = new sap.ui.model.json.JSONModel(scannedData)
                this.getView().setModel(oModel,"barScannerDataModel")

              } else {
                MessageToast.show("No data found in scan", { duration: 1000 });
              }
            }
          },
     
    
        onDealerDashboardICQrCode: function(oEvent){
            let oSource = oEvent.getSource()
            let oBinding = oSource.getBindingContext("newArrayModel")
            let oData = oBinding.getObject()
             let BoxQRCodeURL = oData.ICQRCodeUrl;
            let oDialog = this.byId("DealerDashboard_QRDialog");
            let oImage = this.byId("DealerDashboard_QRImage");
            oImage.setSrc(BoxQRCodeURL);
            oDialog.open();
        }, 

        onCloseQRDialog: function () {
            this.byId("DealerDashboard_QRDialog").close();
        }, 

        onDealerDashboardPrintQR: function () {
            var oImage = this.byId("dashboardDetailsqrImage");
            var sImageSrc = oImage.getSrc();
            if (sImageSrc) {
                var oImageElement = new Image();
                oImageElement.onload = function () {
                    console.log("Image loaded successfully. Proceeding to print...");
                    var oWindow = window.open("", "_blank");
                    oWindow.document.write('<html><head><title>Print QR Code</title></head><body>');
                    oWindow.document.write('<img src="' + sImageSrc + '" style="width:200px;height:200px;"/>');
                    oWindow.document.write('</body></html>');
                    oWindow.document.close();
                    setTimeout(() => {
                        oWindow.print();
                        oWindow.close(); 
                    }, 500); 
                };
                oImageElement.onerror = function () {
                    console.error("Failed to load the QR code image from URL:", sImageSrc);
                    sap.m.MessageToast.show("Failed to load the QR code image.");
                };
                oImageElement.src = sImageSrc;
            } else {
                console.warn("QR Code source is empty or undefined.");
                sap.m.MessageToast.show("QR Code is not available for printing.");
            }
        },

        onDealerDashboardBoxQrCode: function(oEvent){
            let oSource = oEvent.getSource()
            let oBinding = oSource.getBindingContext("newArrayModel")
            let oData = oBinding.getObject()
             let BoxQRCodeURL = oData.BoxQRCodeUrl;
            let oDialog = this.byId("DealerDashboard_QRDialog");
            let oImage = this.byId("DealerDashboard_QRImage");
            oImage.setSrc(BoxQRCodeURL);
            oDialog.open();
        },
        
    });
});