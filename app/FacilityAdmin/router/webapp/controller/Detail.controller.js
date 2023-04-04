sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment"
], function (Controller, Fragment) {
	"use strict";

	return Controller.extend("sap.ui.facility.app.controller.Detail", {
		onInit: function () {
			this.oOwnerComponent = this.getOwnerComponent();

			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel();

			this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onProductMatched, this);

			this._formFragments = {};

			// Set the initial form to be the display one
			this._showFormFragment("Display");
		},

		onSupplierPress: function (oEvent) {
			var supplierPath = oEvent.getSource().getBindingContext("products").getPath(),
				supplier = supplierPath.split("/").slice(-1).pop(),
				oNextUIState;

			this.oOwnerComponent.getHelper().then(function (oHelper) {
				oNextUIState = oHelper.getNextUIState(2);
				this.oRouter.navTo("detailDetail", {
					layout: oNextUIState.layout,
					supplier: supplier,
					product: this._product
				});
			}.bind(this));
		},

		_onProductMatched: function (oEvent) {
			this._product = oEvent.getParameter("arguments").product || this._product || "0";
			this.getView().bindElement({
				path: "/Notifications/" + this._product,
				model: "notifications"
			});
		},

		onEditToggleButtonPress: function() {
			var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();

			oObjectPage.setShowFooter(!bCurrentShowFooterState);

			this._toggleButtonsAndView(true);
		},

		onEditCancelPress: function() {
			var oObjectPage = this.getView().byId("ObjectPageLayout");

			oObjectPage.setShowFooter(false);

			this._toggleButtonsAndView(false);
		},

		onEditSavePress: function() {
			var oObjectPage = this.getView().byId("ObjectPageLayout");

			oObjectPage.setShowFooter(false);

			this._toggleButtonsAndView(false);
			const {WRKBUILDING, WRKDESKKEYS, WRKFLOOR, WRKSTATION, EXTERNALID} = this.getView().getModel("products").getData().Notifications[this._product]

			$.ajax({
				url: `/api/v1/Notifications/${EXTERNALID}/workstation`,
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({WRKBUILDING, WRKDESKKEYS, WRKFLOOR, WRKSTATION}),
				success: function(result){
					console.log("Workstation Updated !")
				}
			})
		},

		_toggleButtonsAndView : function (bEdit) {
			var oView = this.getView();

			// Show the appropriate action buttons
			// oView.byId("edit").setVisible(!bEdit);
			// oView.byId("save").setVisible(bEdit);
			// oView.byId("cancel").setVisible(bEdit);

			// Set the right form type
			this._showFormFragment(bEdit ? "Change" : "Display");
		},

		_showFormFragment : function (sFragmentName) {
			var oPage = this.byId("rBlocks");

			oPage.removeAllSubSections();
			this._getFormFragment(sFragmentName).then(function(oVBox){
				oPage.insertSubSection(oVBox);
			});
		},

		_getFormFragment: function (sFragmentName) {
			var pFormFragment = this._formFragments[sFragmentName],
				oView = this.getView();

			if (!pFormFragment) {
				pFormFragment = Fragment.load({
					id: oView.getId(),
					name: "sap.ui.facility.app.view.fragments." + sFragmentName
				});
				this._formFragments[sFragmentName] = pFormFragment;
			}

			return pFormFragment;
		},

		handleFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
		},

		handleExitFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
		},

		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", {layout: sNextLayout});
		},

		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
		}
	});
});
