import 'solid-devtools';
import './index.css';

import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import { MetaProvider } from '@solidjs/meta'; 
import { routes } from './routes';
import App from './app';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(
  () => (
    <MetaProvider>
      <Router root={(props) => <App>{props.children}</App>}>
        {routes}
      </Router>
    </MetaProvider>
  ),
  root!
);