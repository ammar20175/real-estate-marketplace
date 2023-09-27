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

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<>
				<Route path="/" element={<Home />} />

				<Route path="/sign-in" element={<SignIn />} />

				<Route path="/sign-up" element={<SignUp />} />

				<Route path="/about" element={<About />} />

				<Route path="/profile" element={<Profile />} />
			</>
		)
	);

	return <RouterProvider router={router} />;
}

export default App;
