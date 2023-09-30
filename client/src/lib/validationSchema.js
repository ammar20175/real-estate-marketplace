import * as yup from "yup";

export const signUpSchema = yup.object().shape({
	username: yup.string().required("username is required"),
	email: yup
		.string()
		.email("please enter a valid email")
		.required("email is required"),
	password: yup
		.string()
		.required("password is required.")
		.min(6, "password should be atleast 6 characters long."),
});
