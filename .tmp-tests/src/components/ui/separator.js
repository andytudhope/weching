"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Separator = Separator;
const jsx_runtime_1 = require("react/jsx-runtime");
const radix_ui_1 = require("radix-ui");
const utils_1 = require("@/lib/utils");
function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
    return ((0, jsx_runtime_1.jsx)(radix_ui_1.Separator.Root, { "data-slot": "separator", decorative: decorative, orientation: orientation, className: (0, utils_1.cn)("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", className), ...props }));
}
