import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'config/config';
import { store } from '@app/store/store';
import PwaSupportChecker from '@app/components/PwaSupportChecker'; // Import the new component

interface EventTarget {
  state?: 'activated';
}

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

// Temporarily disable StrictMode to avoid findDOMNode deprecation warnings from Ant Design components
// TODO: Re-enable StrictMode once Ant Design is updated or components are properly refactored
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PwaSupportChecker />
      <App />
    </Provider>
  // </React.StrictMode>
);

// Disable service worker for localhost testing to avoid caching issues
if (window.location.hostname !== 'localhost') {
  serviceWorkerRegistration.register({
    onUpdate: (registration) => {
      const waitingServiceWorker = registration.waiting;

      if (waitingServiceWorker) {
        waitingServiceWorker.addEventListener('statechange', (event) => {
          if ((event.target as EventTarget).state === 'activated') window.location.reload();
        });
        waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
      }
    },
  });
} else {
  // Unregister service worker on localhost to prevent caching conflicts
  serviceWorkerRegistration.unregister();
}

reportWebVitals();

// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import './i18n';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// import 'config/config';
// import { Provider } from 'react-redux';
// import { store } from '@app/store/store';
// import { createRoot } from 'react-dom/client';
// import React from 'react';

// interface EventTarget {
//   state?: 'activated';
// }

// const container = document.getElementById('root') as HTMLElement;
// const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>,
// );

// serviceWorkerRegistration.register({
//   onUpdate: (registration) => {
//     const waitingServiceWorker = registration.waiting;

//     if (waitingServiceWorker) {
//       waitingServiceWorker.addEventListener('statechange', (event) => {
//         if ((event.target as EventTarget).state === 'activated') window.location.reload();
//       });
//       waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
//     }
//   },
// }); // app will reload if new version of app is available

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
