import { RouterProvider } from 'react-router-dom';
import { router } from './shared/App.routing';
import { Provider } from 'react-redux';
import store from './redux/store';

export const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );np
};
