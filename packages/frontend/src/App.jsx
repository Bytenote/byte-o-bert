import CssBaseline from '@mui/material/CssBaseline';
import { RouterProvider } from 'react-router-dom';
import router from './app/router';
import UserInteraction from './components/UserInteraction/UserInteraction.jsx';

const App = () => {
	return (
		<>
			<CssBaseline />
			<UserInteraction />
			<RouterProvider router={router} />
		</>
	);
};

export default App;
