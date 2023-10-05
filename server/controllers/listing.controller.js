import Listing from "../models/listing.model";
import { errorHandler } from "../utils/error";
import xss from "xss";

export const createListing = async (req, res, next) => {
	const sanitizedBody = {
		title: xss(req.body.title),
		description: xss(req.body.description),
		address: xss(req.body.address),
		regularPrice: Number(xss(req.body.regularPrice)),
		discountPrice: Number(xss(req.body.discountPrice)),
		bathrooms: Number(xss(req.body.bathrooms)),
		bedrooms: Number(xss(req.body.bedrooms)),
		furnished: Boolean(xss(req.body.furnished)),
		parking: Boolean(xss(req.body.parking)),
		type: xss(req.body.type),
		offer: Boolean(xss(req.body.offer)),
		imageUrls: xss(req.body.imageUrls),
		userRef: xss(req.body.userRef),
	};

	try {
		const listing = await Listing.create(sanitizedBody);
		return res.status(201).json(listing);
	} catch (error) {
		console.log("this is error \n \n \n", error);
		return next(error);
	}
};
