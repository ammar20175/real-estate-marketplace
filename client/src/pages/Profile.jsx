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

export default function Profile() {
	const { currentUser } = useSelector((state) => state.user);
	const fileRef = useRef(null);
	const [file, setFile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [formData, setFormData] = useState({});

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
					setFormData({ ...formData, avatar: downloadURL })
				);
			}
		);
	};

	return (
		<section className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

			<form className="flex flex-col gap-4">
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
					src={formData.avatar || currentUser.avatar}
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
					placeholder={currentUser.username}
					className="placeholder:text-black"
				/>
				<InputField type="email" placeholder={currentUser.email} />
				<InputField type="password" placeholder="new password" />

				<MainButton className="bg-slate-700">Update</MainButton>
			</form>

			<div className="flex justify-between mt-4">
				<span className="m-1 font-semibold text-red-700 cursor-pointer hover:opacity-70">
					Delete Account ?
				</span>
				<span className="m-1 font-semibold text-red-700 cursor-pointer hover:opacity-70">
					Logout
				</span>
			</div>
		</section>
	);
}
