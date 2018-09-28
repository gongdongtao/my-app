import React from 'react';
import { shallow } from 'enzyme';
import { Demo } from '../../../src/features/examples';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Demo />);
  expect(renderedComponent.find('.examples-demo').length).toBe(1);
});
