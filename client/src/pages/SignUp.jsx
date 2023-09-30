import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../lib/validationSchema";
import MainButton from "../components/MainButton";
import newRequest from "../lib/newRequest";
import { toast } from "react-toastify";
import errorHandler from "../lib/errorHandler";

export default function SignUp() {
	const navigate = useNavigate();
	// for loading state
	const [isSubmitting, setIsSubmitting] = useState(false);

	//react-hook-form
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({ resolver: yupResolver(signUpSchema) });

	const onSubmit = async ({ username, email, password }) => {
		setIsSubmitting(true);

		try {
			await newRequest.post("/auth/signup", { username, email, password });

			toast.success("Account created Successfully.");

			setTimeout(() => {
				navigate("/sign-in");
			}, 3000);
		} catch (error) {
			errorHandler(error);
		}

		setIsSubmitting(false);
		reset();
	};

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

			<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
				{/* input fields */}

				<InputField
					type="text"
					placeholder="username"
					{...register("username")}
					invalid={!!errors.username}
					errorMessage={errors.username?.message}
				/>
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
					Sign Up
				</MainButton>
			</form>

			<div className="flex gap-2 mt-5">
				<p>Have an account</p>
				<Link to="/sign-in">
					<span className="text-blue-700">Sign in</span>
				</Link>
			</div>
		</div>
	);
}
