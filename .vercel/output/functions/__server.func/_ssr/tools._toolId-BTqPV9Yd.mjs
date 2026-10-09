import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools._toolId-BTqPV9Yd.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "py-16 text-center",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-serif text-2xl italic",
		children: "No such tool."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/",
		className: "mt-4 inline-block text-sm text-muted hover:text-fg",
		children: "Back to the store"
	})]
});
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
