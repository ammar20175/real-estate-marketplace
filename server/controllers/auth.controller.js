import User from "../models/user.model";
import bcrypt from "bcrypt";
import xss from "xss";
import { errorHandler } from "../utils/error";

export const signup = async (req, res, next) => {
	const sanitizedBody = {
		username: xss(req.body.username),
		email: xss(req.body.email),
		password: xss(req.body.password),
	};

	const hashedPassword = await bcrypt.hash(sanitizedBody.password, 10);

	const newUser = new User({
		username: sanitizedBody.username,
		email: sanitizedBody.email,
		password: hashedPassword,
	});

	try {
		const userExists = await User.find({
			$or: [
				{ email: sanitizedBody.email },
				{ username: sanitizedBody.username },
			],
		});

		if (userExists.length > 0)
			return next(
				errorHandler(409, "Username already in use. Please choose another")
			);

		await newUser.save();

		res.status(201).json("User created successfully!");
	} catch (error) {
		next(error);
	}
};
