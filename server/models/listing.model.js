import mongoose, { Schema } from "mongoose";

const listingSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		address: { type: String, required: true },
		regularPrice: { type: Number, required: true },
		discountPrice: { type: Number },
		bathrooms: { type: Number, required: true },
		bedrooms: { type: Number, required: true },
		furnished: { type: Boolean, required: true },
		parking: { type: Boolean, required: true },
		type: { type: String, required: true },
		offer: { type: Boolean, default: false },
		imageUrls: { type: Array, required: true },
		userRef: { type: String, required: true },
	},
	{ timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
