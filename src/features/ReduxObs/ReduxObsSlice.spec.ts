import reduxObsSlice, {
  createApp,
  SolangState,
} from './ReduxObsSlice';

describe('solang reducer', () => {
  const initialState: SolangState = {
    config: {},
    apps: []
  };
  it('should handle initial state', () => {
    expect(reduxObsSlice(undefined, { type: 'unknown' })).toEqual({
      config: {},
      apps: []
    });
  });
});
