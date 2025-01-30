sap.ui.define(["sap/ui/core/Fragment","sap/ui/model/Filter","sap/ui/model/FilterOperator"],
    function (Fragment,Filter,FilterOperator) {
   "use strict";
   return {

    // code is using for opening a value help dialog
       _openValueHelpDialog: function (oController, fragmentId, fragmentName) {
           let oView = oController.getView();

           if (!oController[fragmentId]) {
               return Fragment.load({
                   id: oView.getId(),
                   name: fragmentName,
                   controller: oController
               }).then(oDialog => {
                   oController[fragmentId] = oDialog;
                   oView.addDependent(oController[fragmentId]);
                   oController[fragmentId].open();
               }).catch(error => {
                   console.warn("Fragment not Loading", error);
               });
           } else {
               oController[fragmentId].open();
           }
       },

       //set the selected item's value inside input field from value help    
       _valueHelpSelectedValue : function(oEvent,oController,inputId){
           let inputValue = oController.byId(inputId)
           let sSelect = oEvent.getParameter("selectedItem")
           let sValue = sSelect.getTitle()
          if(sValue){
            inputValue.setValue(sValue)
            oEvent.getSource().getBinding("items").filter([]);
            return sValue
          }
          else{
            console.warn("Selected Value Not Found!!")
          }
       },

       //clear the value from form or input fields     
       _clearInputValues : function(oControl,ids){
        if(Array.isArray(ids)){
            ids.forEach(id=>{
                let inputField = oControl.byId(id)
                if(inputField){
                    inputField.setValue("")
                }
                else{
                    console.warn(`${id} not Found`)
                }
            })  
        }
        else{
            console.warn("Invalid Id")
        }
       },

      // code is using for searching the item
      _valueHelpLiveSearch: function (oEvent, filterField) {
        let sValue =
            oEvent.getParameter("value") ||
            oEvent.getParameter("query") ||
            oEvent.getParameter("newValue");
        let oSource = oEvent.getSource(); 
        let oBinding = oSource.getBinding("items");
        let oSelectDialog = oSource.getParent();
        if (!oBinding) {
            console.warn("No binding found for items.");
            return;
        }
        if (sValue) {
            let oFilter = new sap.ui.model.Filter(filterField, sap.ui.model.FilterOperator.Contains, sValue);
            oBinding.filter([oFilter]);
    
            oBinding.attachEventOnce("dataReceived", function () {
                let aItems = oBinding.getCurrentContexts();
                if (oSelectDialog && oSelectDialog.setNoDataText) {
                    oSelectDialog.setNoDataText(aItems.length === 0 ? "No data found" : "Loading...");
                }
            });
        } else {
            oBinding.filter([]);
        }
    },

    // read data based on property 
    _getSingleEntityDataWithParam : async function(oControl,url,property,param){
       let oModel = oControl.getOwnerComponent().getModel()
       let oBindList = oModel.bindList(`/${url}(${property}='${param}')`)
       try {
        let oContext = await oBindList.requestContexts(0,Infinity)
        let oData = oContext.map(context=>context.getObject())
        if(oData.length===0){
            sap.m.MessageToast.show("Data Not Found")
            return
        }
        return oData
       } catch (error) {
        console.log(`Error occurred while reading data from the '${url}' entity : `, error)
        sap.m.MessageToast.show(error)
       }
    },

    //read all data of a entity  
    _getSingleEntityData :async function(oControl,url){
        let oModel = oControl.getOwnerComponent().getModel()
        let oBindList = oModel.bindList(`/${url}`)
        try {
            let oContext = await  oBindList.requestContexts(0,Infinity)
            let oData = oContext.map(context=>context.getObject())
            if(oData.length === 0){
                return console.log("Data Not Found")
            }
            return oData
        } catch (error) {
            console.log(`Error occurred while reading data from the '${url}' entity : `, error)
        }
    },

    // searching on table with muliple filter value 
    performTableSearchMethod: function (oConrol,oEvent, tableId, filterFields) {
        const sValue = oEvent.getParameter("query") || oEvent.getParameter("newValue");
        const oTable = oConrol.getView().byId(tableId);
        if (!oTable) {
            console.error("Table not found");
            return;
        }
        const aFilters = filterFields.map((field) =>
            new sap.ui.model.Filter(field, sap.ui.model.FilterOperator.Contains, sValue)
        );
        const oFilter = new sap.ui.model.Filter({
            filters: aFilters,
            and: false
        });
        const oBinding = oTable.getBinding("items");
        if (!oBinding) {
            console.error("Table binding not found");
            return;
        }
        oBinding.filter(oFilter);
    },

    // get input fileds values
    _getInputValues: function (oControl,inputIds) {
        if (Array.isArray(inputIds)) {
            return inputIds.map(id => {
                let inputField = oControl.byId(id); 
                if (inputField) {
                    return inputField.getValue();
                } else {
                    console.warn("Input field not found for ID:", id);
                    return null; 
                }
            });
        } else {
            console.error("Input IDs must be an array. Received:", inputIds);
            return [];
        }
    }, 
   };
});
