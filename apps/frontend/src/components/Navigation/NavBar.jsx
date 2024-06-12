import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import DashboardIcon from '@mui/icons-material/Speed';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { GET_USER } from '../../graphql/queries/userQueries';
import DiscordAvatar from '../DiscordAvatar/DiscordAvatar';
import { useAnchor, useMenuItems } from './navigation.hooks';
import { navItems } from './navigation.constants';
import avatar from '../../assets/avatar.png';
import './navigation.css';

const NavBar = () => {
	return (
		<AppBar component="nav" position="static">
			<Toolbar className="content">
				<LogoButton />

				<div className="flex-justify-end">
					<NavBarElements />
					<UserMenu />
				</div>
			</Toolbar>
		</AppBar>
	);
};

const LogoButton = () => {
	return (
		<Button
			className="nav-logo-btn"
			startIcon={
				<DiscordAvatar
					className="nav-avatar"
					src={avatar}
					alt="Byte-O-Bert logo"
				/>
			}
			size="small"
			disableRipple
			component={Link}
			to="/"
			state={{ from: window.location.pathname }}
		>
			<span className="hide-600">Byte-O-Bert</span>
		</Button>
	);
};

const NavBarElements = () => {
	return (
		<List
			className="flex-center nav-items"
			aria-labelledby="main navigation"
		>
			{navItems.map(({ name, path }) => (
				<li key={name}>
					<Button
						key={name}
						startIcon={<DashboardIcon />}
						disableRipple
						component={Link}
						to={path}
						state={{ from: window.location.pathname }}
					>
						<ListItemText primary={name}>{name}</ListItemText>
					</Button>
				</li>
			))}
		</List>
	);
};

const UserMenu = () => {
	const { anchorEl, setMenu, closeMenu } = useAnchor(null);

	return (
		<>
			<Button onClick={setMenu} disableRipple>
				<UserAvatar />
			</Button>
			{anchorEl && (
				<UserMenuItems anchorEl={anchorEl} closeMenu={closeMenu} />
			)}
		</>
	);
};

const UserAvatar = () => {
	const { data } = useQuery(GET_USER, {
		fetchPolicy: 'cache-only',
	});

	return (
		<DiscordAvatar
			className="nav-user-icon"
			src={data?.user?.avatar ?? null}
			type="user"
			discordId={data?.user?._id}
			alt="User avatar"
		/>
	);
};

const UserMenuItems = ({ anchorEl, closeMenu }) => {
	const { isOwner, logoutUser } = useMenuItems();

	return (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			open={!!anchorEl}
			onClose={closeMenu}
			keepMounted
		>
			{isOwner && (
				<MenuItem component={Link} to="/settings" onClick={closeMenu}>
					<span className="flex-justify-center">
						<SettingsIcon className="nav-menu-icon" size="small" />
						Settings
					</span>
				</MenuItem>
			)}
			<MenuItem onClick={logoutUser}>
				<span className="flex-justify-center">
					<LogoutIcon className="nav-menu-icon" />
					Logout
				</span>
			</MenuItem>
		</Menu>
	);
};

export default NavBar;
