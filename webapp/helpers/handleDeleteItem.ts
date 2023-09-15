import Dialog from "sap/m/Dialog";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Button from "sap/m/Button";
import Text from "sap/m/Text";
import { ButtonType } from "sap/m/library";
import Event from "sap/ui/base/Event";
import EventProvider from "sap/ui/base/EventProvider";
import StandardListItem from "sap/m/StandardListItem";

export default function deleteItem(oEvent: Event<object, EventProvider>,oModel: ODataModel) {
	// Get the selected list item
	const oListItem = oEvent.getSource() as StandardListItem;

	// Get the binding context to access the item's data
	const oBindingContext = oListItem.getBindingContext("content");

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
				type: ButtonType.Reject, // Use Reject for the "Delete" button it only makes the button look prettier
				text: "Delete",
				press: () => {
					//Calling remove to delete data
					const sEntityPath = "/OData_ContentSet('" + oSelectedItemData.ContentId + "')";
					oModel.remove(sEntityPath, {
						success: () => {
							// Delete successful, you can update the list
							oModel.submitChanges();
							location.reload(); //Starts the reload of the page to retrigger GET request for OData
						},
						error: (oError: any) => {
							// Handle error
							console.error("Error deleting item:", oError);
						},
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