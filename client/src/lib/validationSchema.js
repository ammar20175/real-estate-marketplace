import * as yup from "yup";

export const signUpSchema = yup.object().shape({
	username: yup.string().required("username is required."),
	email: yup
		.string()
		.email("enter a valid email.")
		.required("email is required."),
	password: yup
		.string()
		.required("password is required.")
		.min(6, "password should be atleast 6 characters long."),
});

export const signInSchema = yup.object().shape({
	email: yup
		.string()
		.email("enter a valid email.")
		.required("email is required."),
	password: yup.string().required("password is required."),
});

export const updateUserSchema = yup.object().shape({
	username: yup.string().min(6, "username should be atleast 6 characters"),
	email: yup.string().email("enter a valid email"),
	password: yup.lazy((value) =>
		value
			? yup.string()?.min(6, "password should be atleast 6 characters long.")
			: yup.string()
	),
});

export const listingSchema = yup.object().shape({
	title: yup
		.string()
		.min(10, "title should be more than 10 characters.")
		.max(70, "title should be not more than 70 characters.")
		.required("title required."),
	description: yup
		.string()
		.min(50, "description should be more than 50 characters.")
		.max(1500, "description should be not more than 1500 characters.")
		.required("description required"),
	address: yup.string().required("address required."),
	bedrooms: yup.string().required("required"),
	bathrooms: yup.string().required("required"),
	regularPrice: yup.string().required("required"),
	discountPrice: yup
		.string()
		.test(
			"is-less-than-regular-price",
			"Discount price should be less than regular price",
			function (value) {
				const regularPrice = this.parent.regularPrice;
				if (value && regularPrice) {
					return parseFloat(value) < parseFloat(regularPrice);
				}

				return true;
			}
		),
	offer: yup.boolean(),
	parking: yup.boolean(),
	furnished: yup.boolean(),
});
