import User from "../models/user.model";
import { errorHandler } from "../utils/error";
import xss from "xss";
import bcrypt from "bcrypt";

export const updateUser = async (req, res, next) => {
	const id = xss(req.params.id);
	if (req.user.id !== id) return next(errorHandler(401, "invalid request"));

	const sanitizedBody = {
		username: xss(req.body.username),
		email: xss(req.body.email),
		password: xss(req.body.password),
		avatar: xss(req.body.avatar),
	};
	const updates = {};

	if (sanitizedBody.username) updates.username = sanitizedBody.username;
	if (sanitizedBody.email) updates.email = sanitizedBody.email;
	if (sanitizedBody.avatar) updates.avatar = sanitizedBody.avatar;
	if (sanitizedBody.password) {
		updates.password = await bcrypt.hash(sanitizedBody.password, 10);
	}

	try {
		//check if already user exit with same email or username
		const alreadyEmailUsed = await User.findOne({ email: sanitizedBody.email });

		if (alreadyEmailUsed)
			return next(
				errorHandler(409, "email already in use.select another email")
			);

		const alreadyUsernameUsed = await User.findOne({
			username: sanitizedBody.username,
		});

		if (alreadyUsernameUsed)
			return next(
				errorHandler(409, "username already in use.select another username")
			);

		const updateUser = await User.findByIdAndUpdate(id, updates, { new: true });

		const { password, ...restUserInfo } = updateUser._doc;

		res.status(200).json(restUserInfo);
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

export const deleteUser = async (req, res, next) => {
	const id = xss(req.params.id);
	if (req.user.id !== id) return next(errorHandler(401, "invalid request"));

	try {
		await User.findByIdAndDelete(id);

		res
			.clearCookie("access_token")
			.status(200)
			.json("User deleted successfully");
	} catch (error) {
		return next(error);
	}
};
