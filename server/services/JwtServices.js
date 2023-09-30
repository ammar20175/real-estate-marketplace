import jwt from "jsonwebtoken";
import { JWT_KEY } from "../config";

class JwtServices {
	//this static method will be used for signing the payload.
	static sign(payload, secret = JWT_KEY, expiry = "2592000s") {
		return jwt.sign(payload, secret, { expiresIn: expiry });
	}

	//this static method will be used to verify the token
	static verify(payload, secret = JWT_KEY) {
		return jwt.verify(payload, secret);
	}
}

export default JwtServices;
