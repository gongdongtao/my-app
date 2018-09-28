// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html
import {
  WelcomePage,
  CounterPage,
  RedditListPage,
  Layouts,
  Demo,
} from './';

export default {
  path: 'examples',
  name: 'Examples',
  component: Layouts,
  childRoutes: [
    { path: '', name: 'Welcome page', component: WelcomePage },
    { path: 'counter', name: 'Counter page', component: CounterPage },
    { path: 'reddit', name: 'Reddit list page', component: RedditListPage },
    { path: 'demo', name: 'Demo page', component: Demo },
  ],
};
