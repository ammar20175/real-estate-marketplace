import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../lib/validationSchema";
import MainButton from "../components/MainButton";
import newRequest from "../lib/newRequest";
import errorHandler from "../lib/errorHandler";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

export default function SignIn() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// for loading state
	const [isSubmitting, setIsSubmitting] = useState(false);

	//react-hook-form
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({ resolver: yupResolver(signInSchema) });

	const onSubmit = async ({ email, password }) => {
		setIsSubmitting(true);

		try {
			const { data } = await newRequest.post("/auth/signin", {
				email,
				password,
			});

			//set the user data into redux
			dispatch(signInSuccess(data));

			navigate("/");
		} catch (error) {
			errorHandler(error);
		}

		setIsSubmitting(false);
		reset();
	};

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

			<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
				{/* input fields */}
				<InputField
					type="email"
					placeholder="email"
					{...register("email")}
					invalid={!!errors.email}
					errorMessage={errors.email?.message}
				/>
				<InputField
					type="password"
					placeholder="password"
					{...register("password")}
					invalid={!!errors.password}
					errorMessage={errors.password?.message}
				/>

				{/* buutom */}
				<MainButton
					className="bg-slate-700"
					type="submit"
					isLoading={isSubmitting}
				>
					Sign In
				</MainButton>
			</form>

			<div className="flex gap-2 mt-5">
				<p>Dont have an account</p>
				<Link to="/sign-up">
					<span className="text-blue-700">Sign Up</span>
				</Link>
			</div>
		</div>
	);
}
