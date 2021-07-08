import { SolangReducer, } from './solang.slice';
describe('solang reducer', () => {
    const initialState = {
        config: {},
        apps: {}
    };
    it('should handle initial state', () => {
        expect(SolangReducer(undefined, { type: 'unknown' })).toEqual({
            config: {},
            apps: {}
        });
    });
});
//# sourceMappingURL=solang.slice.spec.js.map