import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { p as cn } from "./router-Bj9pAB_N.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md bg-surface-2 px-3 text-sm text-fg shadow-[0_0_0_1px_var(--color-border)] transition-[box-shadow] duration-150 placeholder:text-subtle focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40", className),
		...props
	});
}
//#endregion
export { Input as t };
