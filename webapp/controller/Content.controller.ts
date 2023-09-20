import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import StandardListItem from "sap/m/StandardListItem";
import List from "sap/m/List";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Dialog from "sap/m/Dialog";
import Button from "sap/m/Button";
import Input from "sap/m/Input";
import Text from "sap/m/Text";

import deleteItem from "../helpers/handleDeleteItem";


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
						template: new StandardListItem({
							//Sets the list item to be pressable
							type: "Active",
							title: "{content>ContentId}",
							//Handles the press event
							press(oEvent) {
								deleteItem(oEvent, oModel);
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
			title:"Add Content",
			content: [ new Text({text:"Your Content Id should look like this: CONT0000"})
						,contentIdInput, contentInput],
			beginButton: new Button({
				text: "Submit",
				press: () => {
					const contentId = contentIdInput.getValue();
					const content = contentInput.getValue();

					const newEntry = {
						ContentId: contentId,
						Content: content 
					}
					

					oModel.createEntry("/OData_ContentSet", {
						properties: newEntry
					})

					oModel.submitChanges()

					oDialog.close();
					oDialog.destroy();
				}
			}),
			endButton: new Button({
				text: "Cancel",
				press:() => {
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
