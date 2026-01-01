import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import Home from './pages/home';
import Support from './pages/support';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
    {
    path: '/support',
    component: Support,
  }
];
