import User from "../models/user.model";
import bcrypt from "bcrypt";
import xss from "xss";
import { errorHandler } from "../utils/error";
import JwtServices from "../services/JwtServices";

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

// login controller
export const signin = async (req, res, next) => {
	const sanitizedBody = {
		email: xss(req.body.email),
		password: xss(req.body.password),
	};

	try {
		if (!sanitizedBody.email || !sanitizedBody.password)
			return next(errorHandler(409, "email and password required"));

		const validUser = await User.findOne({ email: sanitizedBody.email });

		if (!validUser)
			return next(errorHandler(409, "email or password is in correct"));

		const validPassword = await bcrypt.compare(
			sanitizedBody.password,
			validUser.password
		);

		if (!validPassword)
			return next(errorHandler(409, "email or password is in correct"));

		const token = await JwtServices.sign({ id: validUser._id });

		const { password: pass, ...restUserInfo } = validUser._doc;
		res
			.cookie("access_token", token, { httpOnly: true })
			.status(200)
			.json(restUserInfo);
	} catch (error) {
		return next(error);
	}
};
