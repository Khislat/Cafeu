import { ObjectId } from "mongoose";
import {
	ProductCollection,
	ProductSize,
	ProductStatus,
} from "../enums/product.enum";

export interface Product {
	_id: ObjectId;
	productStatus: ProductStatus;
	productCollection: ProductCollection;
	productName: string;
	productPrice: number;
	productLeftCount: number;
	productSize: ProductSize;
	productVolume: Number;
	productDesc?: string;
	productImages: string[];
	productViews: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductInquiry {
	order: string;
	page: number;
	limit: number;
	productCollection?: ProductCollection;
	search?: string;
}

export interface ProductInput {
	productStatus?: ProductStatus;
	productCollection: ProductCollection;
	productName: string;
	productPrice: number;
	productLeftCount: number;
	productSize?: ProductSize;
	productVolume?: Number;
	productDesc?: string;
	productImages?: string[];
	productViews?: number;
}

export interface ProductUpdateInput {
	productImage: string;
	_id: ObjectId;
	productStatus?: ProductStatus;
	productCollection?: ProductCollection;
	productName?: string;
	productPrice?: number;
	productLeftCount?: number;
	productSize?: ProductSize;
	productVolume?: Number;
	productDesc?: string;
	productImages?: string[];
	productViews?: number;
}
