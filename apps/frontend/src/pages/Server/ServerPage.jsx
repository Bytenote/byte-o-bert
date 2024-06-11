import { memo } from 'react';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';
import { VirtuosoGrid } from 'react-virtuoso';
import { guildCommandSearchVar } from '../../graphql/reactiveVars/guildVars.js';
import DiscordAvatar from '../../components/DiscordAvatar/DiscordAvatar.jsx';
import Spinner from '../../components/Loading/Spinner.jsx';
import SearchField from '../../components/SearchField/SearchField.jsx';
import ServerCommand from '../../components/ServerCommand/ServerCommand.jsx';
import { MAIN_DATA_FIELDS, SECONDARY_DATA_FIELDS } from './server.constants.js';
import {
	useCommands,
	useGeneralGuild,
	usePrefix,
	useRootQuery,
} from './server.hooks.js';
import {
	commandSearchClearHelper,
	commandSearchHelper,
	createCommandHandler,
	getGuildDataProp,
	submitHandler,
} from './server.helpers.js';
import './server.css';

/**
 * Component that renders the server page.
 * It displays the general server data, including the
 * message command prefix, and the list of all commands.
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
export const ServerPage = () => {
	const guildId = useRootQuery();

	return <PageContent guildId={guildId} />;
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
	({ guildId }) => {
		return (
			<>
				<Fade in className="content-container" timeout={300}>
					<div>
						<div className="content-container-heading">
							<span>General</span>
						</div>
						<div className="content-inner-container">
							<GeneralData guildId={guildId} />
						</div>
					</div>
				</Fade>
				<Fade in className="content-container" timeout={300}>
					<div>
						<div className="content-container-heading">
							<CommandsHeader guildId={guildId} />
						</div>
						<div className="content-inner-container">
							<CommandsGrid guildId={guildId} />
						</div>
					</div>
				</Fade>
			</>
		);
	},
	() => true // never re-render
);

const GeneralData = ({ guildId }) => {
	const response = useGeneralGuild(guildId);

	return (
		<div className="server-data-general">
			<DiscordAvatar
				src={response?.data?.guildGeneral?.icon}
				alt={response?.data?.guildGeneral?.name ?? 'Server Icon'}
				type="guild"
				discordId={guildId}
				className="server-general-avatar hide-500"
			/>
			<div className="server-info-container">
				{MAIN_DATA_FIELDS.map(({ text, key }, index) => (
					<div className="server-general-info" key={index}>
						<DataElement
							response={response}
							text={text}
							prop={key}
						/>
					</div>
				))}

				<div className="server-data-grid">
					{SECONDARY_DATA_FIELDS.map(({ text, key }, index) => (
						<div key={index}>
							<DataElement
								response={response}
								text={text}
								prop={key}
							/>
						</div>
					))}
				</div>

				<PrefixForm guildId={guildId} />
			</div>
		</div>
	);
};

const DataElement = ({ response, text, prop }) => {
	const data = getGuildDataProp(response, 'guildGeneral', prop);

	return (
		<div className="server-general-info">
			<span className="secondary-text">{text}:</span>
			<span className="primary-text">{data}</span>
		</div>
	);
};

const PrefixForm = ({ guildId }) => {
	const { input, onChangeHandler } = usePrefix(guildId);

	return (
		<form onSubmit={submitHandler} className="prefix-form" name={guildId}>
			<label className="secondary-text">
				Prefix:
				<Input
					className="prefix-input"
					value={input}
					name="prefix"
					onChange={onChangeHandler}
					autoComplete="off"
				/>
			</label>
			<PrefixButton />
		</form>
	);
};

const PrefixButton = memo(() => {
	return (
		<Tooltip
			title="Update prefix"
			TransitionComponent={Zoom}
			enterDelay={300}
			enterNextDelay={150}
			leaveDelay={150}
			arrow
			disableInteractive
		>
			<Button
				className="prefix-btn"
				startIcon={<CachedIcon />}
				type="submit"
				variant="contained"
			/>
		</Tooltip>
	);
});

const CommandsHeader = ({ guildId }) => {
	return (
		<>
			<span>Commands</span>
			<div className="commands-header-right">
				<Button
					className="add-command-btn"
					onClick={createCommandHandler}
					startIcon={<AddIcon />}
					variant="contained"
					name={guildId}
				>
					New
				</Button>
				<SearchField
					className="commands-search-field"
					searchVar={guildCommandSearchVar}
					label="Command"
					details="commands"
					func={commandSearchHelper}
					clearFunc={commandSearchClearHelper}
				/>
			</div>
		</>
	);
};

/**
 * Component that renders the virtualized list
 * of (filtered) server commands.
 *
 * @returns {JSX.Element}
 */
const CommandsGrid = ({ guildId }) => {
	const { loading, error, filteredCommands } = useCommands(guildId);

	if (loading) {
		return <Spinner />;
	}

	if (error) {
		return <p>Error: {error.message}</p>;
	}

	return (
		<VirtuosoGrid
			style={{ overflowY: 'auto', height: '40vh', minHeight: '375px' }}
			data={filteredCommands}
			listClassName="commands-grid"
			itemContent={commandRenderer}
		/>
	);
};

/**
 * Renderer function for Virtuoso, that returns each
 * server command card.
 *
 * @param {Object} _		- Unused index
 * @param {Object} command	- Command object
 * @returns {JSX.Element}
 */
const commandRenderer = (_, command) => (
	<ServerCommand key={command.name} name={command.name} />
);

export default ServerPage;
