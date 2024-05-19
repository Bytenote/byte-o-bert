import { memo } from 'react';
import { useQuery } from '@apollo/client';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import AddIcon from '@mui/icons-material/Add';
import { Virtuoso } from 'react-virtuoso';
import { GET_SETTINGS } from '../../graphql/queries/settingsQueries.js';
import { GET_SETTINGS_PAGE } from '../../graphql/queries/pageRoots/settingsPageQueries.js';
import { adminSearchVar } from '../../graphql/reactiveVars/adminVars';
import SearchField from '../../components/SearchField/SearchField.jsx';
import AccountItem from '../../components/AccountItem/AccountItem.jsx';
import Spinner from '../../components/Loading/Spinner.jsx';
import { useAdmins } from './settings.hooks.js';
import {
	adminSearchClearHelper,
	adminSearchHelper,
	createAdminHelper,
	togglePrivateHandler,
} from './settings.helpers.js';
import './settings.css';

/**
 * Component that renders the settings page.
 * The settings page contains administrative settings
 * for the bot, that only the bot owner, defined in the
 * environment variables, can access.
 *
 * This component fetches all the necessary data for the
 * entire page, so that the child components can request
 * only their specific data directly from the cache.
 *
 * It returns the PageContent component, which is memoized
 * to prevent re-renders on re-run queries due to data changes.
 *
 * @returns {JSX.Element}
 */
export const SettingsPage = () => {
	useQuery(GET_SETTINGS_PAGE, {
		fetchPolicy: 'network-only',
		nextFetchPolicy: 'cache-first',
	});

	return <PageContent />;
};

/**
 * Component that renders the content of the settings page.
 * It is memoized with a custom equality function to only render
 * once, to prevent re-renders when the parent fetches new data.
 *
 * To keep the child components up to date, they are making
 * their own queries directly to the cache, so that only the
 * necessary components re-render when data changes and no new
 * queries to the server are made.
 *
 * @returns {JSX.Element}
 */
const PageContent = memo(
	() => {
		return (
			<Fade in className="content-container" timeout={300}>
				<div>
					<div className="content-container-heading">
						<span>Settings</span>
					</div>
					<div className="content-inner-container">
						<div className="settings-option">
							<div className="content-description">
								<ListItemText
									primary="Privatize bot"
									secondary="Make bot private to allow only admins to add it to their Discord servers"
								/>
							</div>

							<div className="flex-align-center">
								<PrivateToggle />
							</div>
						</div>
						<div className="settings-option">
							<div className="content-description">
								<ListItemText
									primary="Manage admins"
									secondary="Manage who can add the bot, if it is private"
								/>
							</div>

							<ManageAdmins />
						</div>
					</div>
				</div>
			</Fade>
		);
	},
	() => true // never re-render
);

const PrivateToggle = () => {
	const { data } = useQuery(GET_SETTINGS, {
		fetchPolicy: 'cache-only',
	});

	return (
		<Switch
			size="small"
			name="isPrivate"
			checked={data?.settings?.isPrivate ?? true}
			onChange={togglePrivateHandler}
			inputProps={{ 'aria-label': 'Privatize bot' }}
		/>
	);
};

const ManageAdmins = () => {
	return (
		<>
			<div className="flex-align-center">
				<Tooltip
					title="Add admin(s)"
					TransitionComponent={Zoom}
					enterDelay={300}
					enterNextDelay={150}
					leaveDelay={150}
					arrow
					disableInteractive
				>
					<Button
						className="add-admin-btn"
						onClick={createAdminHelper}
						startIcon={<AddIcon />}
						variant="contained"
					/>
				</Tooltip>
				<SearchField
					className="settings-admin-search-field"
					searchVar={adminSearchVar}
					label="Admin"
					details="admins"
					func={adminSearchHelper}
					clearFunc={adminSearchClearHelper}
				/>
			</div>
			<AccountList />
		</>
	);
};

const AccountList = () => {
	const { loading, filteredAdmins } = useAdmins();

	if (loading) {
		return <Spinner />;
	}

	return (
		<Virtuoso
			style={{
				height: `${filteredAdmins.length * 72.5}px`,
				maxHeight: '400px',
				width: '100%',
				marginTop: '5px',
			}}
			data={filteredAdmins}
			components={{
				List: List,
				Item: ListItem,
			}}
			itemContent={accountRenderer}
		/>
	);
};

/**
 * Renderer function for Virtuoso, that returns each
 * account item in the virtualized list.
 *
 * @param {number} _ 		- Index of the account item
 * @param {Object} account	- Account object
 * @returns {JSX.Element}
 */
const accountRenderer = (_, account) => {
	return <AccountItem account={account} />;
};
