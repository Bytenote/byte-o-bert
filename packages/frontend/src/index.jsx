import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import '@fontsource/nunito/200.css';
import '@fontsource/nunito/300.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/nunito/900.css';
import '@fontsource/roboto';
import App from './App.jsx';
import client from './graphql/index.js';
import './styling/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
