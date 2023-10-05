import { motion } from "framer-motion";
import { forwardRef } from "react";

const InputField = forwardRef(
	({ invalid, errorMessage, className, onChange, ...props }, ref) => {
		return (
			<div>
				<input
					onChange={onChange}
					ref={ref}
					{...props}
					className={[
						`border p-3 rounded-lg w-full outline-gray-400`,
						className,
					].join(" ")}
				/>

				{invalid && (
					<motion.p
						initial={{ y: -10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.4, ease: "easeOut" }}
						className="my-1 ml-1 text-xs text-red-400"
					>
						{errorMessage}
					</motion.p>
				)}
			</div>
		);
	}
);

export default InputField;
