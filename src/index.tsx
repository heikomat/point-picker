import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { ToastContainer } from 'react-toastify';
import { MotionConfig } from "framer-motion"

import 'react-toastify/dist/ReactToastify.css';

const motionConfig = {
  duration: 0.175,
  ease: 'easeInOut',
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <MotionConfig transition={motionConfig}>
        <App />
      </MotionConfig>
      <ToastContainer />
    </ChakraProvider>
  </React.StrictMode>
);


serviceWorkerRegistration.register();
