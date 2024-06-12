import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGOUT_USER } from '../../graphql/mutations/userMutations';
import { GET_USER } from '../../graphql/queries/userQueries';
import { snackbarVar } from '../../graphql/reactiveVars/userInteractionVars';

/**
 * Custom hook that handles the navigation menu
 * item functionality.
 * It returns an object with a boolean value indicating
 * whether the user is the owner of the application,
 * and a function to logout the user.
 * On logout, the user is redirected to the
 * login page and a snackbar message is displayed.
 * Upon failure, a snackbar message is displayed.
 *
 * @returns {Function}
 */
export const useMenuItems = () => {
	const navigate = useNavigate();
	const { data } = useQuery(GET_USER, {
		fetchPolicy: 'cache-only',
	});
	const [logoutUser] = useMutation(LOGOUT_USER, {
		onCompleted: () => {
			navigate('/login', {
				replace: true,
				state: { from: window.location.pathname },
			});

			snackbarVar({
				isOpen: true,
				key: 'LogoutSuccess',
			});
		},
		onError: (error) => {
			snackbarVar({
				isOpen: true,
				key: 'LogoutError',
			});
		},
		update(cache, { data }) {
			const userCacheId = cache.identify({
				__typename: 'User',
				id: data?.logoutUser?._id,
			});

			if (userCacheId) {
				// evict user from cache
				cache.evict({ id: userCacheId });
				cache.gc();
			}
		},
	});

	return { isOwner: !!data?.user?.isOwner, logoutUser };
};

/**
 * Custom hook for managing anchor element state
 * of a menu.
 * Returns an object with the anchor element state,
 * a setter function for the anchor element state,
 * and a function to handle the menu.
 *
 * @param {HTMLElement} initVal - Initial value of the anchor element
 * @returns {Object}
 */
export const useAnchor = (initVal = null) => {
	const [anchorEl, setAnchorEl] = useState(initVal);

	const setMenu = useCallback((e) => {
		setAnchorEl(e?.currentTarget);
	}, []);

	const closeMenu = useCallback(() => {
		setAnchorEl(null);
	}, []);

	return { anchorEl, setMenu, closeMenu };
};
