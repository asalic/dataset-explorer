import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

// Careful with the order of CSS loading, if you want to modify Bootstrap's settings
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
import AppKeycloak from './AppKeycloak';
import config from "./service/config";
import {store} from "./store";

//const Loading = () => <div>Loading, please wait...</div>

function favicon(rel: string, iconPath: string): void {
      const link: HTMLLinkElement = document.querySelector(`link[rel*='${rel}']`) || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = config.publicURL + iconPath;
      document?.getElementsByTagName('head')[0]?.appendChild(link);
}
if (config.project?.favicon) {
      favicon("icon", config.project.favicon);
      favicon("apple-touch-icon", config.project.favicon);
}

const domNode: HTMLElement | null = document.getElementById('root');
if (domNode) {
      const root = createRoot(domNode);
      root.render(
            <Provider store={store}>
                  <AppKeycloak />
            </Provider>
      );
}
