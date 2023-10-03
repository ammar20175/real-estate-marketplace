import { useSelector } from "react-redux";
import InputField from "../components/InputField";
import MainButton from "../components/MainButton";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../config/firebase-config";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateUserSchema } from "../lib/validationSchema";
import newRequest from "../lib/newRequest";
import { useDispatch } from "react-redux";
import {
	updateUserSuccess,
	deletUserSuccess,
	signOutSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const fileRef = useRef(null);
	const [file, setFile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [image, setImage] = useState("");

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
	}, [file]);

	const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePerc(Math.round(progress));
			},
			() => {
				toast.error("Oops something went wrong");
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
					setImage(downloadURL)
				);
			}
		);
	};

	//react-hook form
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(updateUserSchema) });

	const onSubmit = async ({ username, email, password }) => {
		const updates = {};
		//check if the values have been changed
		if (username !== currentUser.username) updates.username = username;

		if (email !== currentUser.email) updates.email = email;

		if (password) updates.password = password;

		try {
			if (image) {
				updates.avatar = image;
			}

			const { data } = await newRequest.put(`user/update/${currentUser._id}`, {
				...updates,
			});

			dispatch(updateUserSuccess(data));
			setFilePerc(0);
			toast.success("Profile Updated Successfully");
		} catch (error) {
			if (error.response.status === 409)
				toast.error(error.response.data.message);
			else toast.error("Something went wrong try late.");
		}
	};

	// delete the user
	const handleDeleteUser = async () => {
		try {
			const { status } = await newRequest.delete(
				`/user/delete/${currentUser._id}`
			);
			if (status === 200) {
				toast.success("Account deleted Successfully");
				dispatch(deletUserSuccess());
			}
		} catch (error) {
			toast.error("Something went wrong try late.");
		}
	};

	const handleSignOut = async () => {
		try {
			const { status } = await newRequest(`/auth/signout`);

			if (status === 200) {
				dispatch(signOutSuccess());
			}
		} catch (error) {
			toast.error("Something went wrong try late.");
		}
	};

	return (
		<section className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

			<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
				{/* image file  */}
				<input
					type="file"
					ref={fileRef}
					hidden
					accept="image/*"
					onChange={(e) => setFile(e.target.files[0])}
				/>
				<motion.img
					whileTap={{ scale: 0.9, transition: { ease: "easeOut" } }}
					onClick={() => fileRef.current.click()}
					className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
					src={image || currentUser.avatar}
					alt="profilePic"
				/>

				<p className="text-sm self-center">
					{filePerc > 0 && filePerc < 100 ? (
						<span className="text-slate-700">{`Uploading ${" "} ${filePerc} %`}</span>
					) : filePerc === 100 ? (
						<span className="text-green-700">Image successfully upload!</span>
					) : (
						""
					)}
				</p>

				<InputField
					type="text"
					defaultValue={currentUser.username}
					{...register("username")}
					invalid={!!errors.username}
					errorMessage={errors.username?.message}
				/>
				<InputField
					type="email"
					defaultValue={currentUser.email}
					{...register("email")}
					invalid={!!errors.email}
					errorMessage={errors.email?.message}
				/>
				<InputField
					type="password"
					placeholder="new password"
					{...register("password")}
					invalid={!!errors.password}
					errorMessage={errors.password?.message}
				/>

				<MainButton type="submit" className="bg-slate-700">
					Update
				</MainButton>
			</form>

			<div className="flex justify-between mt-4">
				<span
					className="m-1 font-semibold text-red-700 cursor-pointer hover:opacity-70"
					onClick={handleDeleteUser}
				>
					Delete Account ?
				</span>
				<span
					className="m-1 font-semibold text-red-700 cursor-pointer hover:opacity-70"
					onClick={handleSignOut}
				>
					Logout
				</span>
			</div>
		</section>
	);
}
