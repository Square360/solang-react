"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolangFacet = exports.solangReducer = void 0;
const solang_slice_1 = __importDefault(require("./solang/store/solang.slice"));
exports.solangReducer = solang_slice_1.default;
const SolangFacet_1 = __importDefault(require("./solang/components/SolangFacet/SolangFacet"));
exports.SolangFacet = SolangFacet_1.default;
//# sourceMappingURL=lib.js.map