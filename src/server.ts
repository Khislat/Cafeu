import dotenv from "dotenv";
dotenv.config({
	path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});
import mongoose from "mongoose";
import server from "./app";

mongoose
	.connect(process.env.MONGO_URL as string, {})
	.then((data) => {
		console.log("MongoDb connection succesed");
		const PORT = (process.env.PORT as string) ?? 3003;
		server.listen(PORT, function () {
			console.info(`The server is running successfuly on port ${PORT}`);
			console.info(`Admin project on http://localhost:${PORT}/admin \n`);
		});
	})
	.catch((err) => {
		console.log("ERROR on connection MongoDB", err);
	});
