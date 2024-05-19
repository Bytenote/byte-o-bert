import { useQuery } from '@apollo/client';
import Fade from '@mui/material/Fade';
import { VirtuosoGrid } from 'react-virtuoso';
import { GET_DASHBOARD_PAGE } from '../../graphql/queries/pageRoots/dashboardPageQueries.js';
import {
	GUILD_ELIGIBLE_SEARCH_FRAGMENT,
	GUILD_MUTUAL_SEARCH_FRAGMENT,
} from '../../graphql/fragments/userBotGuildsFragments.js';
import {
	eligibleGuildSearchVar,
	mutualGuildSearchVar,
} from '../../graphql/reactiveVars/userGuildVars.js';
import { useSearchFragment } from '../../hooks/useSearch.js';
import Spinner from '../../components/Loading/Spinner';
import SearchField from '../../components/SearchField/SearchField.jsx';
import ServerCard from '../../components/ServerCard/ServerCard';
import { FRAGMENT_REF } from './dashboard.constants.js';
import {
	filterGuildsByName,
	userGuildSearchClearHelper,
	userGuildSearchHelper,
} from './dashboard.helpers.js';
import './dashboard.css';

/**
 * Component that renders the dashboard page.
 * It displays the user's mutual and eligible servers.
 *
 * @returns {JSX.Element}
 */
export const DashboardPage = () => {
	const { data, loading, error } = useQuery(GET_DASHBOARD_PAGE, {
		fetchPolicy: 'network-only',
		nextFetchPolicy: 'cache-first',
	});

	if (loading) {
		return <Spinner className="dashboard-loading" />;
	}

	if (error) {
		return <p>Error: {error.message}</p>;
	}

	if (
		data?.settings?.isPrivate &&
		data?.userBotGuilds?.mutual?.length === 0 &&
		data?.userBotGuilds?.eligible?.length === 0
	) {
		return (
			<ServerContainer heading="Host your own bot" type="private">
				<ContainerContent type="private" />
			</ServerContainer>
		);
	}

	return (
		<>
			{data?.userBotGuilds?.mutual?.length > 0 && (
				<ServerContainer heading="Manage servers" type="mutual">
					<ContainerContent
						guilds={data?.userBotGuilds?.mutual}
						type="mutual"
					/>
				</ServerContainer>
			)}
			{data?.userBotGuilds?.eligible?.length > 0 && (
				<ServerContainer heading="Invite to servers" type="eligible">
					<ContainerContent
						guilds={data?.userBotGuilds?.eligible}
						type="eligible"
					/>
				</ServerContainer>
			)}
		</>
	);
};

const ServerContainer = ({ heading, type, children }) => {
	return (
		<Fade in className="content-container" timeout={170}>
			<div>
				<ServerHeading heading={heading} type={type} />
				<div
					className="content-inner-container"
					style={
						type !== 'private'
							? {
									height: '30vh',
									minHeight: '400px',
							  }
							: {
									paddingBottom: '1rem',
							  }
					}
				>
					{children}
				</div>
			</div>
		</Fade>
	);
};

const ContainerContent = ({ type, guilds }) => {
	if (guilds?.length > 0) {
		// render grid of guilds if available
		return (
			<ServerGrid
				fragment={
					type === 'mutual'
						? GUILD_MUTUAL_SEARCH_FRAGMENT
						: GUILD_ELIGIBLE_SEARCH_FRAGMENT
				}
				type={type}
				searchVar={
					type === 'mutual'
						? mutualGuildSearchVar
						: eligibleGuildSearchVar
				}
			/>
		);
	}

	if (type === 'private') {
		// render private bot message
		return (
			<div>
				This is a private bot. To host your own check out the
				<a
					className="dashboard-repo-link"
					href="https://github.com/bytenote/byte-o-bert"
					target="_blank"
					rel="noreferrer"
				>
					GitHub repo!
				</a>
			</div>
		);
	}

	// render no servers message
	return (
		<div>
			Looks like you don't have any servers to manage, but you can create
			one in Discord!
		</div>
	);
};

const ServerHeading = ({ heading, type }) => {
	return (
		<div className="content-container-heading">
			<div>{heading}</div>
			{type !== 'private' && (
				<SearchField
					searchVar={
						type === 'mutual'
							? mutualGuildSearchVar
							: eligibleGuildSearchVar
					}
					label="Server name"
					func={userGuildSearchHelper}
					clearFunc={userGuildSearchClearHelper}
					details={type}
				/>
			)}
		</div>
	);
};

/**
 * Component that renders a virtualized grid of servers.
 * The guilds are retrieved from a GraphQL fragment and
 * filtered based on a reactive search variable.
 *
 * @param {Object} props
 * @param {Object} props.fragment	- GraphQL fragment
 * @param {Object} props.searchVar	- Reactive search variable
 * @param {string} props.type		- Type of guilds: 'mutual' | 'eligible'
 * @returns {JSX.Element}
 */
const ServerGrid = ({ fragment, searchVar, type }) => {
	const filteredGuilds = useSearchFragment(
		fragment,
		FRAGMENT_REF,
		searchVar,
		filterGuildsByName,
		type
	);

	return (
		<VirtuosoGrid
			style={{ overflowY: 'auto' }}
			data={filteredGuilds}
			listClassName="server-grid"
			itemContent={type === 'mutual' ? mutualRenderer : eligibleRenderer}
		/>
	);
};

/**
 * Renderer function for Virtuoso Grid, that returns each
 * mutual server card.
 *
 * @param {number} index - Index of the server card
 * @param {Object} guild - Guild object
 * @returns {JSX.Element} - Server card
 */
const mutualRenderer = (index, guild) => (
	<ServerCard key={index} index={index} guild={guild} type="mutual" />
);

/**
 * Renderer function for Virtuoso Grid, that returns each
 * eligible server card.
 *
 * @param {number} index - Index of the server card
 * @param {Object} guild - Guild object
 * @returns {JSX.Element} - Server card
 */
const eligibleRenderer = (index, guild) => (
	<ServerCard key={index} index={index} guild={guild} type="eligible" />
);

export default DashboardPage;
