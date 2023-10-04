import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import List from "sap/m/List";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Dialog from "sap/m/Dialog";
import Button from "sap/m/Button";
import Input from "sap/m/Input";
import Text from "sap/m/Text";

import { ButtonType } from "sap/m/library";
import CustomListItem from "sap/m/CustomListItem";
import Label from "sap/m/Label";
import VerticalLayout from "sap/ui/layout/VerticalLayout";


interface Content {
	ContentId: string,
	Content: string
}

/**
 * @namespace sampleApplication.controller
 */
export default class ContentController extends BaseController {
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
						template: new CustomListItem({
							// Sets the list item to be pressable
							type: "Active",
							content: new VerticalLayout({
								content: [
									new Label({ text: "Content ID: {content>ContentId}"}),
									new Label({ text: "Content: {content>Content}"}),
									new Button({
										text: "Delete",
										type: ButtonType.Reject, // Use Reject for the "Delete" button to make it look prettier,
										press: (oEvent) => {
											const oListItem = oEvent.getSource() as CustomListItem;

									// Get the binding context to access the item's data
									const oBindingContext = oListItem.getBindingContext("content");

									if (oBindingContext) {
										// Retrieve the data for the selected item
										const oSelectedItemData = oBindingContext.getProperty("");

										// Create a new dialog to display the selected item's content
										const oDialog = new Dialog({
											title: "Selected Item",
											content: new VerticalLayout({
												content: [
													new Text({ text: "Content ID: " + oSelectedItemData.ContentId + "\n" }),
													new Text({ text: "Content: " + oSelectedItemData.Content }),
												]
											}),
											beginButton: new Button({
												type: ButtonType.Reject, // Use Reject for the "Delete" button to make it look prettier
												text: "Delete",
												press: () => {
													// Calling remove to delete data
													const sEntityPath = "/OData_ContentSet('" + oSelectedItemData.ContentId + "')";

													oModel.remove(sEntityPath, {
														success: () => {
															oModel.submitChanges();

															this.fetchContent(oModel).then((newData) => {
																const oUserModel = this.getView().getModel("content") as JSONModel;
																oUserModel.setProperty("/", newData);
															});
														},
														error: (oError: any) => {
															// Handle error
															console.error("Error deleting item:", oError);
														},
														refreshAfterChange: true,
													});

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
									})
								]
							}),
							press: (oEvent) => {
								const oListItem = oEvent.getSource() as CustomListItem;
								const oBindingContext = oListItem.getBindingContext("content");
								const oSelectedItemData = oBindingContext.getProperty("");

								const oRouter = this.getOwnerComponent().getRouter();
								oRouter.navTo("ContentDisplay",{contentid: window.encodeURIComponent(oSelectedItemData.ContentId)});
							},
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
		const contentIdInput = new Input({
			placeholder: "Content ID",
			value: ""
		});

		const contentInput = new Input({
			placeholder: "Content",
			value: ""
		});
		const oView = this.getView();

		const oModel = oView.getModel() as ODataModel;

		const oDialog = new Dialog({
			title: "Add Content",
			content: [new Text({ text: "Your Content Id should look like this: CONT0000" })
				, contentIdInput, contentInput],
			beginButton: new Button({
				text: "Submit",
				type: ButtonType.Accept,
				press: () => {
					const contentId = contentIdInput.getValue();
					const content = contentInput.getValue();

					const newEntry = {
						ContentId: contentId,
						Content: content
					}


					oModel.createEntry("/OData_ContentSet", {
						properties: newEntry,
						refreshAfterChange: true
					})

					oModel.submitChanges();

					this.fetchContent(oModel).then((newData) => {
						const oUserModel = this.getView().getModel("content") as JSONModel;
						oUserModel.setProperty("/", newData);
					})

				oDialog.close();
				oDialog.destroy();
				}
			}),
			endButton: new Button({
				text: "Cancel",
				press: () => {
					oDialog.close();
					oDialog.destroy();
				}
			}),
		});

		// Open the dialog
		oDialog.open();
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

}
