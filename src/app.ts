import cors from "cors";
import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { MORGAN_FORMAT } from "./libs/config";
import { T } from "./libs/types/common";

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
	uri: String(process.env.MONGO_URL),
	collection: "sessions",
});

/** 1 - ENTERENCE **/
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));

/** 2 - SESSIONS **/
app.use(
	session({
		secret: String(process.env.SESSION_SECRET),
		cookie: {
			maxAge: 1000 * 3600 * 6, // 6H
		},
		store: store,
		resave: true, // 10:30 auth => 13:30 12:00 => 15:00
		saveUninitialized: true,
	})
);
app.use(function (req, res, next) {
	const sessionInstance = req.session as T;
	res.locals.member = sessionInstance.member;
	next();
});

/** 3 - VIEWS **/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); // BSSR

/** 4 - ROUTERS **/
app.use("/admin", routerAdmin); //SSR
app.use("/", router); // SPA: REACT

export default app; //modeule.export = app;
