sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.ingenx.dealer.controller.Home", {
        onInit() {
        },

        onPressRetaileRegistration: function () {
            const tile = this.getOwnerComponent().getRouter();
            tile.navTo("RouteRetailerRegistor");
        },
        onPressDealerDashboard: function () {
            const tile = this.getOwnerComponent().getRouter();
            tile.navTo("RouteDealerDashboard");
        },
        onPressReatilerMapping: function () {
            const tile = this.getOwnerComponent().getRouter();
            tile.navTo("RoutedealerInvMapping");
        },
        onPressRetailerListing: function () {
            const tile = this.getOwnerComponent().getRouter();
            tile.navTo("RouteretailerListing");
        },
    });
});