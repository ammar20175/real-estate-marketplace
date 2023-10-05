import { useState } from "react";
import InputField from "../components/InputField";
import MainButton from "../components/MainButton";
import { toast } from "react-toastify";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../config/firebase-config";
import { useForm } from "react-hook-form";
import { listingSchema } from "../lib/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import newRequest from "../lib/newRequest";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate();

	const [files, setFiles] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [imageRequired, setImageRequired] = useState(false);
	const [someData, setSomeData] = useState({
		imageUrls: [],
		type: "rent",
	});

	const handleImageSubmit = (e) => {
		if (files.length > 0 && files.length + someData.imageUrls.length < 7) {
			setUploading(true);
			const promises = [];

			for (let i = 0; i < files.length; i++) {
				promises.push(storeImage(files[i]));
			}

			Promise.all(promises)
				.then((urls) => {
					setSomeData({
						...someData,
						imageUrls: someData.imageUrls.concat(urls),
					});
					setUploading(false);
				})
				.catch((error) => {
					toast.error("Something went wrong.Try Again later");
				});
		} else {
			toast.error("You can only upload upto 6 images");
			setUploading(false);
		}
	};

	const storeImage = async (file) => {
		return new Promise((resolve, reject) => {
			const storage = getStorage(app);
			const fileName = new Date().getTime() + file.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				"state_changed",
				() => {},
				(error) => {
					reject(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
						resolve(downloadUrl);
					});
				}
			);
		});
	};

	const handleRemoveImage = (index) => {
		setSomeData({
			...someData,
			imageUrls: someData?.imageUrls.filter((_, i) => i !== index),
		});
	};

	//react-hook form
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		reset,
	} = useForm({ resolver: yupResolver(listingSchema) });

	const offer = watch("offer");

	//only rent or sell should selected.
	const handleSellOrRent = (e) => {
		if (e.target.id === "sell" || e.target.id === "rent") {
			setSomeData({
				...someData,
				type: e.target.id,
			});
		}
	};

	const onSubmit = async (values) => {
		if (someData?.imageUrls.length === 0) return setImageRequired(true);

		const discountPrice = values?.offer ? values.discountPrice : 0;
		const userRef = currentUser._id;
		const listingData = {
			...values,
			...someData,
			userRef,
			discountPrice,
		};

		try {
			const { data } = await newRequest.post("/listing/create", listingData);

			toast.success("Listing created successfully.");
			reset();
			setSomeData({ imageUrls: [], type: "rent" });
			setTimeout(() => {
				navigate(`/listing/${data._id}`);
			}, 3000);
		} catch (error) {
			toast.error("Something went wrong try again later");
		}
	};

	return (
		<main className="p-3 max-w-5xl mx-auto ">
			<h1 className="text-3xl font-semibold text-center my-7">
				Create Listing
			</h1>

			{/* form because we have to submit every thing. */}

			<form
				className="flex gap-4 flex-col sm:flex-row"
				onSubmit={handleSubmit(onSubmit)}
			>
				{/* left side */}
				<div className="flex flex-col gap-4 flex-1">
					<InputField
						type="text"
						placeholder="Title"
						{...register("title")}
						invalid={!!errors.title}
						errorMessage={errors.title?.message}
					/>

					<textarea
						rows="4"
						placeholder="Description"
						className="border-2 outline-gray-400 p-3 rounded-lg"
						{...register("description")}
						invalid={!!errors.description}
						errorMessage={errors.description?.message}
					/>

					{!!errors.description && errors.description?.message && (
						<p className="my-1 ml-1 text-xs text-red-400">
							{errors.description?.message}
						</p>
					)}

					<InputField
						type="text"
						placeholder="Address"
						{...register("address")}
						invalid={!!errors.address}
						errorMessage={errors.address?.message}
					/>

					<div className="flex gap-6 flex-wrap mt-2">
						<div className="flex gap-2 items-center">
							<input
								type="checkbox"
								className="w-5 h-5"
								id="sell"
								onChange={handleSellOrRent}
								checked={someData.type === "sell"}
							/>
							<span>Sell</span>
						</div>

						<div className="flex gap-2 items-center">
							<input
								type="checkbox"
								className="w-5 h-5"
								id="rent"
								onChange={handleSellOrRent}
								checked={someData.type === "rent"}
							/>
							<span>Rent</span>
						</div>

						<div className="flex gap-2 items-center">
							<InputField
								type="checkbox"
								className="!w-5 !h-5"
								{...register("parking")}
							/>
							<span>Parking spot</span>
						</div>

						<div className="flex gap-2 items-center">
							<InputField
								type="checkbox"
								className="!w-5 !h-5"
								{...register("furnished")}
							/>
							<span>Furnished</span>
						</div>

						<div className="flex gap-2 items-center">
							<InputField
								type="checkbox"
								className="!w-5 !h-5"
								{...register("offer")}
							/>
							<span>Offer</span>
						</div>
					</div>

					<div className="flex flex-wrap gap-6 mt-2">
						<div className="flex items-center gap-2">
							<InputField
								type="number"
								className="!w-16"
								{...register("bedrooms")}
								invalid={!!errors.bedrooms}
								errorMessage={errors.bedrooms?.message}
							/>
							<span>Beds</span>
						</div>

						<div className="flex items-center gap-2">
							<InputField
								type="number"
								className="!w-16"
								{...register("bathrooms")}
								invalid={!!errors.bathrooms}
								errorMessage={errors.bathrooms?.message}
							/>
							<span>Baths</span>
						</div>

						<div className="flex items-center gap-2">
							<InputField
								type="number"
								className="!w-24"
								{...register("regularPrice")}
								invalid={!!errors.regularPrice}
								errorMessage={errors.regularPrice?.message}
							/>
							<div className="flex flex-col items-center">
								<p>Regular price</p>
								<span className="text-xs">($ / month)</span>
							</div>
						</div>

						{offer && (
							<div className="flex items-center gap-2">
								<InputField
									type="number"
									className="!w-24"
									{...register("discountPrice")}
									invalid={!!errors.discountPrice}
									errorMessage={errors.discountPrice?.message}
								/>
								<div className="flex flex-col items-center">
									<p>Discounted price</p>
									<span className="text-xs">($ / month)</span>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="flex flex-col flex-1 gap-4">
					<p className="font-semibold">
						Images:
						<span className="font-normal text-gray-600 ml-2">
							The first image will be cover (max 6)
						</span>
					</p>

					<div className="flex gap-9">
						<InputField
							onChange={(e) => setFiles(e.target.files)}
							type="file"
							className="border-gray-300 rounded"
							accept="images/*"
							multiple
						/>
						<MainButton
							onClick={handleImageSubmit}
							className="border !text-green-700 border-green-700 rounded"
						>
							{uploading ? "Uploading" : "Upload"}
						</MainButton>
					</div>

					{imageRequired && someData?.imageUrls.length === 0 && (
						<p className="my-1 ml-1 text-xs text-red-400">
							At least one image should be upload
						</p>
					)}

					{someData?.imageUrls.length > 0 &&
						someData?.imageUrls.map((url, index) => (
							<div
								key={url}
								className="flex justify-between p-3 border items-center"
							>
								<img
									src={url}
									alt="image"
									className="w-20 h-20 object-contain rounded-lg"
								/>
								<MainButton
									onClick={() => handleRemoveImage(index)}
									className="border !text-red-700 border-red-700 rounded"
								>
									Delete
								</MainButton>
							</div>
						))}
					<MainButton
						type="submit"
						className="bg-slate-700"
						disabled={uploading}
					>
						Create Listing
					</MainButton>
				</div>
			</form>
		</main>
	);
}
