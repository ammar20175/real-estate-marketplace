import { toast } from "react-toastify";
import MainButton from "./MainButton";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../config/firebase-config";

export default function Oauth() {
	const handleGoogleLogin = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const auth = getAuth(app);

			const {
				_tokenResponse: { idToken },
			} = await signInWithPopup(auth, provider);

			console.log(idToken);
		} catch (error) {
			console.log(error);
			toast.error("Oops something went wrong");
		}
	};

	return (
		<div>
			<MainButton
				onClick={handleGoogleLogin}
				className="bg-red-700"
				fullWidth={true}
			>
				Continue with google
			</MainButton>
		</div>
	);
}
