import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import About from "./pages/About";
import RootLayout from "./pages/RootLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<>
				<Route path="/" element={<RootLayout />}>
					<Route index element={<Home />} />

					<Route path="sign-in" element={<SignIn />} />

					<Route path="sign-up" element={<SignUp />} />

					<Route path="about" element={<About />} />

					<Route path="profile" element={<PrivateRoute />}>
						<Route index element={<Profile />} />
					</Route>
				</Route>
			</>
		)
	);

	return (
		<>
			<ToastContainer
				autoClose={3000}
				closeButton={false}
				position="top-center"
				toastClassName="#0D4041"
			/>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
