import mongoose from "mongoose";
import { MONGO_CONNECTION_URL } from "../config";

const url = MONGO_CONNECTION_URL;

async function connectDataBase() {
	try {
		await mongoose.connect(url);
		console.log("AmmarEstate database connected");
	} catch (error) {
		console.log("database error", error);
	}
}

export default connectDataBase;
