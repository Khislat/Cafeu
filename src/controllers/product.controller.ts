import { Response, Request } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { AdminRequest, ExstendedRequest } from "../libs/types/member";
import {
	ProductInput,
	ProductInquiry,
	ProductUpdateInput,
} from "../libs/types/product";
import { ProductCollection } from "../libs/enums/product.enum";

const productService = new ProductService();

const productController: T = {};

/* SPA */
productController.getProducts = async (req: Request, res: Response) => {
	try {
		console.log("getProducts");
		const { page, limit, order, productCollection, search } = req.query;
		const inquiry: ProductInquiry = {
			order: String(order),
			page: Number(page),
			limit: Number(limit),
		};
		if (productCollection) {
			inquiry.productCollection = productCollection as ProductCollection;
		}

		if (search) inquiry.search = String(search);

		const result = await productService.getProducts(inquiry);

		res.status(HttpCode.OK).json(result);
	} catch (err) {
		console.log("Error getProducts:", err);
		if (err instanceof Errors) res.status(err.code).json(err);
		else res.status(Errors.standart.code).json(Errors.standart);
	}
};

productController.getProduct = async (req: ExstendedRequest, res: Response) => {
	try {
		console.log("getProduct");

		const { id } = req.params;
		const memberId = req.member?._id ?? null,
			result = await productService.getProduct(memberId, id);

		res.status(HttpCode.OK).json(result);
	} catch (err) {
		console.log("Error getProduct:", err);
		if (err instanceof Errors) res.status(err.code).json(err);
		else res.status(Errors.standart.code).json(Errors.standart);
	}
};

/* SSR*/

productController.getAllProducts = async (req: Request, res: Response) => {
	try {
		console.log("getAllProducts");
		const data = await productService.getAllProducts();
		res.render("products", { products: data });
	} catch (err) {
		console.log("Error getAllProducts:", err);
		if (err instanceof Errors) res.status(err.code).json(err);
		else res.status(Errors.standart.code).json(Errors.standart);
	}
};

productController.createNewProduct = async (
	req: AdminRequest,
	res: Response
) => {
	try {
		console.log("createNewProduct");

		if (!req.files?.length)
			throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

		const data: ProductInput = req.body;
		data.productImages = req.files?.map((ele) => {
			return ele.path; //for windows: return ele.replace(/\\/g, "/");
		});

		await productService.creatNewProduct(data);
		res.send(
			`<script> alert ("Sucessful creation"); window.location.replace("/admin/product/all") </script>`
		);
		console.log("data:", data);
	} catch (err) {
		console.log("Error createNewProduct:", err);
		const message =
			err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
		res.send(
			`<script> alert ("${message}"); window.location.replace("/admin/product/all") </script>`
		);
	}
};

productController.updateChosenProduct = async (
	req: ExstendedRequest,
	res: Response
) => {
	try {
		console.log("updateChosenProduct");
		const id = req.params.id;
		const input: ProductUpdateInput = req.body;
		input.productImages = req.files?.map((ele) => {
			return ele.path;
		});

		const result = await productService.updateChosenProduct(id, input);

		res.status(HttpCode.OK).json({ data: result });
	} catch (err) {
		console.log("Error updateChosenProduct:", err);
		if (err instanceof Errors) res.status(err.code).json(err);
		else res.status(Errors.standart.code).json(Errors.standart);
	}
};

export default productController;
