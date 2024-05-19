import { useQuery } from '@apollo/client';
import { Navigate, useLocation } from 'react-router-dom';
import { GET_USER } from '../../graphql/queries/userQueries';

/**
 * Component that wraps around another layout that
 * either requires the user to be authenticated or
 * that the user is redirected to.
 *
 * @param {Object} props 				- Component props
 * @param {JSX.Element} props.children	- Layout children
 * @param {boolean} props.ownerOnly 	- Whether only the owner has access
 * @returns {JSX.Element}
 */
const ProtectedLayout = ({ children, ownerOnly = false }) => {
	const location = useLocation();
	const { loading, error, data } = useQuery(GET_USER);
	const isLoggedIn = !!data?.user?._id && !error;
	const isOwner = !!data?.user?.isOwner;

	if (loading) {
		return null;
	}

	if (!isLoggedIn && location?.pathname !== '/login') {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (ownerOnly && !isOwner) {
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	if (isLoggedIn && location?.pathname === '/login') {
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	return children;
};

export default ProtectedLayout;
