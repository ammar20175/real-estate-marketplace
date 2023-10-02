import { toast } from "react-toastify";
import MainButton from "./MainButton";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../config/firebase-config";
import newRequest from "../lib/newRequest";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";

export default function Oauth() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleGoogleLogin = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const auth = getAuth(app);

			const {
				_tokenResponse: { idToken },
			} = await signInWithPopup(auth, provider);

			const { data } = await newRequest.post("/auth/google", { idToken });

			dispatch(signInSuccess(data));
			navigate("/");
		} catch (error) {
			console.log(error);
			toast.error("Oops something went wrong.Try again after sometime.");
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
