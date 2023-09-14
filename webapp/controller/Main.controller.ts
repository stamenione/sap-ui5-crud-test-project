import BaseController from "./BaseController";
import UIComponent from "sap/ui/core/UIComponent";
/**
 *
 * @namespace sampleApplication.controller
 */
export default class Main extends BaseController {
	onInit(): void {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			this.onPressFirst();
	}

	onPressFirst(): void{
		// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-var
		this.getOwnerComponent().getRouter().navTo("Content");
	}

}
