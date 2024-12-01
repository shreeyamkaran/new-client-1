import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import store from "./redux/store.ts";
import { RouterProvider } from 'react-router-dom';
import router from './utils/router.tsx';
import { ThemeProvider } from './utils/theme-provider.tsx';

createRoot(document.getElementById('root')!).render(
    <ThemeProvider storageKey="vite-ui-theme">
        <Provider store={ store }>
            <RouterProvider router={ router } />
        </Provider>
    </ThemeProvider>
);