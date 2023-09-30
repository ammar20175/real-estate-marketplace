import { Ring } from "@uiball/loaders";
import { motion } from "framer-motion";

const MainButton = ({
	children,
	onClick,
	isLoading,
	fullWidth,
	className,
	...props
}) => {
	return (
		<motion.button
			whileTap={{ scale: 0.95 }}
			onClick={onClick}
			disabled={props.disabled || isLoading}
			type={props.type || "button"}
			className={[
				` text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85`,
				fullWidth ? "w-full" : "",
				className,
			].join(" ")}
		>
			{isLoading ? (
				<div className="flex justify-center items-center">
					<Ring size={20} lineWeight={5} speed={2} color="white" />
				</div>
			) : (
				children
			)}
		</motion.button>
	);
};

export default MainButton;
