import {
  HOME_SEARCH,
} from '../../../../src/features/home/redux/constants';

import {
  search,
  reducer,
} from '../../../../src/features/home/redux/search';

describe('home/redux/search', () => {
  it('returns correct action by search', () => {
    expect(search()).toHaveProperty('type', HOME_SEARCH);
  });

  it('handles action type HOME_SEARCH correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SEARCH }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
