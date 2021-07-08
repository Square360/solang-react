"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const solang_slice_1 = __importDefault(require("./solang.slice"));
describe('solang reducer', () => {
    const initialState = {
        config: {},
        apps: {}
    };
    it('should handle initial state', () => {
        expect(solang_slice_1.default(undefined, { type: 'unknown' })).toEqual({
            config: {},
            apps: {}
        });
    });
});
//# sourceMappingURL=solang.slice.spec.js.map