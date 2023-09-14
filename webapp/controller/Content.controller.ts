import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import StandardListItem from "sap/m/StandardListItem";
import List from "sap/m/List";
import Dialog from "sap/m/Dialog";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Button from "sap/m/Button";
import Text from "sap/m/Text";
import { ButtonType } from "sap/m/library";
import Event from "sap/ui/base/Event";
import EventProvider from "sap/ui/base/EventProvider";

interface Content {
	ContentId: string,
	Content: string
}

/**
 * @namespace sampleApplication.controller
 */
export default class ContentController extends BaseController{

	async onInit(): Promise<void> {
		try {
			const oView = this.getView();

			oView.setModel(this.getOwnerComponent().getModel());

			const oModel = oView.getModel() as ODataModel;

			if (oModel) {
				try {
					const aUserData = await this.fetchContent(oModel);
					const oUserModel = new JSONModel(aUserData);
					oView.setModel(oUserModel, "content");

					const oList: List = oView.byId("contentList") as List;
					oList.bindAggregation("items", {
						path: "content>/",
						template: new StandardListItem({
							type: "Active",
							title: "{content>ContentId}",
							press(oEvent) {
								ContentController.onListItemPress(oEvent);
							},
							description: "{content>Content}",
						}),
					});
				} catch (oError) {
					console.error("Error during data fetching:", oError);
				}
			}
		} catch (oError) {
			console.error("Error during initialization:", oError);
		}
	}

	onBackButtonPress() {
        this.getRouter().navTo("main");
    }

	addNewContent() {
        const oView = this.getView();

		const oModel = oView.getModel() as ODataModel; 

		oModel.createEntry("/OData_ContentSet",{properties:{ContentId:"CONT0002",Content:"It works"}});
		oModel.submitChanges();
    }

	private fetchContent(oModel: ODataModel): Promise<Content[]> {
		return new Promise((resolve, reject) => {
			oModel.read("/OData_ContentSet", {
				success: (oData: { results: Content[] }) => {
					resolve(oData.results);
				},
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				error: (oError: any) => {
					reject(oError);
				},
			});
		});
	}

	static onListItemPress(oEvent: Event<object, EventProvider>) {
		// Get the selected list item
		const oListItem = oEvent.getSource() as StandardListItem;
	
		// Get the binding context to access the item's data
		const oBindingContext = oListItem.getBindingContext("content");
	
		console.log(oBindingContext);
	
		if (oBindingContext) {
			// Retrieve the data for the selected item
			const oSelectedItemData = oBindingContext.getProperty("");
	
			// Create a new dialog to display the selected item's content
			const oDialog = new Dialog({
				title: "Selected Item",
				content: [
					new Text({ text: "Content ID: " + oSelectedItemData.ContentId + "\n" }),
					new Text({ text: "Content: " + oSelectedItemData.Content }),
				],
				beginButton: new Button({
					type: ButtonType.Reject, // Use Reject for the "Delete" button
					text: "Delete",
					press: () => {
						// Implement your delete logic here
						// You can call a delete function or perform any other action
						this.deleteItem(oSelectedItemData);
	
						oDialog.close();
						oDialog.destroy(); // Destroy the dialog to avoid memory leaks
					},
				}),
				endButton: new Button({
					text: "Cancel",
					press: () => {
						oDialog.close();
						oDialog.destroy(); // Destroy the dialog to avoid memory leaks
					},
				}),
			});
	
			// Open the dialog
			oDialog.open();
		}
	}

	// Implement your deleteItem function to delete the selected item
	static deleteItem(_oListItem: Content) {
		// Delete the item logic 
	}
}
