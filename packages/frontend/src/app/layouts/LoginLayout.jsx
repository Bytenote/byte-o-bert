import { Outlet } from 'react-router-dom';

const LoginLayout = () => {
	return (
		<main className="content">
			<Outlet />
		</main>
	);
};

export default LoginLayout;
