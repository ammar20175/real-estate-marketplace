import { toast } from "react-toastify";
import { AxiosError } from "axios";

const errorHandler = (error, message, position) => {
	if (error instanceof AxiosError) {
		if (error?.response?.status === 409) {
			toast.error(message || error?.response?.data?.message, {
				position: position || "top-center",
			});
		} else {
			toast.error("Oops Something went wrong! Try again after sometime.", {
				position: position || "top-center",
			});
		}
	}
};

export default errorHandler;
