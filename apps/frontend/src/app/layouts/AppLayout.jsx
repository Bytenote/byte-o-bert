import { Outlet } from 'react-router-dom';
import NavBar from '../../components/Navigation/NavBar';
import Footer from '../../components/Footer/Footer';

const AppLayout = () => {
	return (
		<>
			<NavBar />
			<main className="content">
				<Outlet />
			</main>
			<Footer />
		</>
	);
};

export default AppLayout;
