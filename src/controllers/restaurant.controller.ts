import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";

const restaurantController: T = {};
const memberService = new MemberService();

restaurantController.goHome = (req: Request, res: Response) => {
	try {
		console.log("goHome");
		res.render("home");
	} catch (err) {
		console.log("Error, goHome:", err);
	}
};
restaurantController.getSignup = (req: Request, res: Response) => {
	try {
		console.log("getSignup");
		res.render("signup");
	} catch (err) {
		res.send(err);
		console.log("Error, getSignup:", err);
		res.redirect("/admin");
	}
};

restaurantController.processSignup = async (
	req: AdminRequest,
	res: Response
) => {
	try {
		console.log("processSignup");
		const file = req.file;
        if (!file)
			throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

		const newMember: MemberInput = req.body;

		newMember.memberImage = file?.path; //for windows: return ele.replace(/\\/g, "/");
		newMember.memberType = MemberType.RESTAURANT;
		const result = await memberService.processSignup(newMember);

		console.log(req.session);
		req.session.member = result;
		req.session.save(function () {
			res.redirect("/admin/product/all");
		});
	} catch (err) {
		console.log("Error, processSignup:", err);
		const message =
			err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
		res.send(
			`<script> alert ("${message}"); window.location.replace("/admin/signup") </script>`
		);
	}
};

restaurantController.getLogin = (req: Request, res: Response) => {
	try {
		console.log("getLogin");
		res.render("login");
	} catch (err) {
		console.log("Error, getLogin:", err);
		res.redirect("/admin");
	}
};

restaurantController.processLogin = async (
	req: AdminRequest,
	res: Response
) => {
	try {
		console.log("processLogin");

		const input: LoginInput = req.body,
			result = await memberService.processLogin(input);

		req.session.member = result;
		req.session.save(function () {
			res.redirect("/admin/product/all");
		});
	} catch (err) {
		console.log("Error, getSignup:", err);
		const message =
			err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
		res.send(
			`<script> alert ("${message}"); window.location.replace("/admin/login") </script>`
		);
	}
};

restaurantController.logout = async (req: AdminRequest, res: Response) => {
	try {
		console.log("logout");
		req.session.destroy(function () {
			res.redirect("/admin");
		});
	} catch (err) {
		res.redirect("/admin");
		console.log("Error, getSignup:", err);
	}
};

restaurantController.checkAuthSession = async (
	req: AdminRequest,
	res: Response
) => {
	try {
		console.log("checkAuthSession");
		if (req.session?.member)
			res.send(`<script> alert ("${req.session.member.memberNick}") </script>`);
		else res.send(`<script> alert ("${Message.NOT_AUTHENTICATED}") </script>`);
	} catch (err) {
		console.log("Error, checkAuthSession:", err);
		res.send(err);
	}
};

/** Users **/

restaurantController.getUsers = async (req: Request, res: Response) => {
	try {
		console.log("getUsers");
		const result = await memberService.getUsers();

		res.render("users", { users: result });
	} catch (err) {
		res.redirect("/admin");
		console.log("Error, getUsers:", err);
	}
};

restaurantController.updateChosenUser = async (
	req: AdminRequest,
	res: Response
) => {
	try {
		console.log("updateChosenUser");
		const result = await memberService.updateChosenUser(req.body);

		res.status(HttpCode.OK).json({ data: result });
	} catch (err) {
		console.log("Error, updateChosenUser:", err);
		if (err instanceof Errors) res.status(err.code).json(err);
		else res.status(Errors.standart.code).json(Errors.standart);
	}
};



restaurantController.verifyRestaurant = (
	req: AdminRequest,
	res: Response,
	next: NextFunction
) => {
	if (req.session?.member?.memberType === MemberType.RESTAURANT) {
		req.member = req.session.member;
		next();
	} else {
		const message = Message.NOT_AUTHENTICATED;
		res.send(
			`<script> alert ("${message}"); window.location.replace("/admin/login"); </script>`
		);
	}
};

export default restaurantController;
