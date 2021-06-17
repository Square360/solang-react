import reduxObsSlice, {
  createApp,
} from './solang.slice';
import { SolangState } from "./solang.types";

describe('solang reducer', () => {
  const initialState: SolangState = {
    config: {},
    apps: {}
  };
  it('should handle initial state', () => {
    expect(reduxObsSlice(undefined, { type: 'unknown' })).toEqual({
      config: {},
      apps: []
    });
  });
});
