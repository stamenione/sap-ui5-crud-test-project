import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import FormattedText from "sap/m/FormattedText";

interface Content {
	ContentId: string,
	Content: string
}
/**
 * @namespace sampleApplication.controller
 */
export default class ContentDisplayController extends BaseController {

	async onInit(): Promise<void> {

		const time = window.decodeURIComponent(window.location.href);
		const data = this.extractDataFromURL(time);

		const oView = this.getView();
		oView.setModel(this.getOwnerComponent().getModel());
		const oModel = oView.getModel() as ODataModel;

		if(oModel){
				const aBooking = await this.fetchOneBooking(oModel,data.deskId);
				const oBookingModel = new JSONModel(aBooking);
				oView.setModel(oBookingModel,"booking");

				console.log(aBooking);

				const foramttedText: FormattedText = oView.byId("formattedText") as FormattedText;

				// Define your formatted text content here
				const formattedTextContent = `
						<strong>Desk ID:</strong> ${aBooking.ContentId}<br>
						<strong>Booked Date:</strong> ${aBooking.Content}<br>
				`;

				foramttedText.setHtmlText(formattedTextContent);
		}
}

extractDataFromURL(url: string) {
		// Split the URL by "/"
		const parts = url.split('/');

		const decoded = window.decodeURIComponent(parts[6]);

		return {deskId: parts[5], bookeddate: decoded, bookfrom: parts[7]};
	}

	onBackButtonPress() {
		this.getRouter().navTo("Content");
	}


private fetchOneBooking(oModel: ODataModel, contentId: any): Promise<Content>{
return new Promise((resolve, reject) => {
	oModel.read(`/OData_ContentSet('${contentId}')`, {
		success: (oData: { ContentId: string, Content: string}) => {

			var booking: Content = {
				ContentId: oData.ContentId,
				Content: oData.Content,
				};

			console.log(booking);	
			resolve(booking);
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		error: (oError: any) => {
			reject(oError);
		}
	})
});
}

}
