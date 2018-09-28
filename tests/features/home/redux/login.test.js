import {
  HOME_LOGIN,
} from '../../../../src/features/home/redux/constants';

import {
  login,
  reducer,
} from '../../../../src/features/home/redux/login';

describe('home/redux/login', () => {
  it('returns correct action by login', () => {
    expect(login()).toHaveProperty('type', HOME_LOGIN);
  });

  it('handles action type HOME_LOGIN correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_LOGIN }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
