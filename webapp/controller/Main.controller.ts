import BaseController from "./BaseController";

/**
 *
 * @namespace sampleApplication.controller
 */
export default class Main extends BaseController {

	onDataNavigate(): void {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-var
		this.getOwnerComponent().getRouter().navTo("Content");
	}

}
