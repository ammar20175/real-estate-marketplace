import JwtServices from "../services/JwtServices";
import { errorHandler } from "./error";

export const verifyUser = async (req, res, next) => {
	const token = req.cookies.access_token;

	if (!token) return next(errorHandler(401, "Unauthorized"));

	try {
		const { id } = await JwtServices.verify(token);

		const user = {
			id,
		};

		req.user = user;

		next();
	} catch (error) {
		return next(errorHandler(401, "Unauthorized"));
	}
};
