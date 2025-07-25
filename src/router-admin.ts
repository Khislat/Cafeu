import { Router } from "express";
const routerAdmin = Router();
import restaurantController from "./controllers/restaurant.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";

/** Restaurant */
routerAdmin.get("/", restaurantController.goHome);

routerAdmin
	.get("/signup", restaurantController.getSignup)
	.post(
		"/signup",
		makeUploader("members").single("memberImage"),
		restaurantController.processSignup
	);

routerAdmin
	.get("/login", restaurantController.getLogin)
	.post("/login", restaurantController.processLogin);

routerAdmin.get("/logout", restaurantController.logout);

routerAdmin.get("/check-me", restaurantController.checkAuthSession);

/** Product */
routerAdmin.get(
	"/product/all",
	restaurantController.verifyRestaurant,
	productController.getAllProducts
);

routerAdmin.post(
	"/product/create",
	restaurantController.verifyRestaurant,
	makeUploader("products").array("productImages", 5),
	productController.createNewProduct
);


routerAdmin.post(
	"/product/:id",
	restaurantController.verifyRestaurant,
	makeUploader("products").array("productImages", 5),
	productController.updateChosenProduct
);
/** User */
routerAdmin.get(
	"/user/all",
	restaurantController.verifyRestaurant,
	restaurantController.getUsers
);

routerAdmin.post(
	"/user/edit",
	restaurantController.verifyRestaurant,
	restaurantController.updateChosenUser
);

export default routerAdmin;

//MVC architechtural pattern
