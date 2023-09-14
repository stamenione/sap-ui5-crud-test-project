// import ODataModel from "sap/ui/model/odata/v2/ODataModel";
// import Table from "sap/m/Table";
// import Column from "sap/m/Column";
// import ColumnListItem from "sap/m/ColumnListItem";
// import Text from "sap/m/Text";
// import JSONModel from "sap/ui/model/json/JSONModel";

import BaseController from "./BaseController";


// interface BookingData {
// 	Mandt: string;
// 	Bookingid: string;
// 	Userid: string;
// 	Room: string;
// 	Desk: string;
// 	Timeto: string;
// 	Timefrom: string;
// }

/**
 *
 * @namespace sampleApplication.controller
 */
export default class Bookings extends BaseController {
	// async onInit(): Promise<void> {
	// 	try {
	// 		const oView = this.getView();
	// 		oView.setModel(this.getOwnerComponent().getModel("Bookings"),"Bookings");
	// 		const oModel = oView.getModel() as ODataModel;

	// 		if (oModel) {
	// 			console.log(oModel)
	// 			try {
	// 				const aBookingData = await this.fetchBookingData(oModel);
	// 				const oBookingModel = new JSONModel(aBookingData);
	// 				oView.setModel(oBookingModel, "bookingModel");

	// 				const oTable: Table = oView.byId("bookingTable") as Table;
	// 				new Table({
	// 					columns: [
	// 						new Column({
	// 							header: new Text({
	// 								text: "User ID"
	// 							})
	// 						}),
	// 						new Column({
	// 							header: new Text({
	// 								text: "Room"
	// 							})
	// 						}),
	// 						new Column({
	// 							header: new Text({
	// 								text: "Desk"
	// 							})
	// 						}),
	// 						new Column({
	// 							header: new Text({
	// 								text: "Time From"
	// 							})
	// 						}),
	// 						new Column({
	// 							header: new Text({
	// 								text: "Time To"
	// 							})
	// 						})
	// 					]
	// 				});

	// 				const oTemplate = new ColumnListItem({
  //           cells: [
  //               new Text({ text: "{bookingModel>Userid}" }),
  //               new Text({ text: "{bookingModel>Room}" }),
  //               new Text({ text: "{bookingModel>Desk}" }),
  //               new Text({ text: "{bookingModel>TimeFrom}" }),
  //               new Text({ text: "{bookingModel>TimeTo}" })
  //           ]
  //       });

	// 				oTable.bindAggregation("items", {
	// 					path: "bookingModel>/",
	// 					template: oTemplate
	// 				});

	// 			} catch (oError) {
	// 				console.log("Error during data fetching:", oError);
	// 			}
	// 		}
	// 	} catch (oError) {
	// 		console.error("Error during initialization:", oError);
	// 	}
	// }

	// private fetchBookingData(oModel: ODataModel): Promise<BookingData[]> {
	// 	return new Promise((resolve, reject) => {
	// 		oModel.read("/DESK_BOOKINGSet", {
	// 			success: (oData: { results: BookingData[] }) => {
	// 				resolve(oData.results);
	// 			},
	// 			// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 			error: (oError: any) => {
	// 				reject(oError);
	// 			},
	// 		});
	// 	});
	// }
}
