import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import StandardListItem from "sap/m/StandardListItem";
import List from "sap/m/List";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";

import onListItemPress from "../helpers/onListItemPress";

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
							type: "Active",
							title: "{content>ContentId}",
							press(oEvent) {
								onListItemPress(oEvent,oModel);
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

		oModel.createEntry("/OData_ContentSet", { properties: { ContentId: "CONT0002", Content: "It works" } });
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

}
