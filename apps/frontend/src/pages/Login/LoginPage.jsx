import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import ListItemText from '@mui/material/ListItemText';
import LoginIcon from '@mui/icons-material/Login';
import DiscordAvatar from '../../components/DiscordAvatar/DiscordAvatar';
import { REVIEWS } from './login.constants';
import avatar from '../../assets/avatar.png';
import { BACKEND_URL } from '../../utils/constants';
import './login.css';

/**
 * Component that renders the login page.
 * It displays the bot's welcome message, login button and reviews.
 *
 * @returns {JSX.Element}
 */
export const LoginPage = () => {
	return (
		<Grid container className="lp flex-center" spacing={2}>
			<Grid item xs={12} md={6}>
				<BotWelcome />
				<Login />
			</Grid>

			<Grid item xs={12} md={1} className="hide-600 flex-center">
				<Divider
					className="lp-divider"
					orientation="vertical"
					flexItem
				/>
			</Grid>

			<Grid item xs={12} md={4} className="flex-center">
				<div className="lp-reviews">
					<Reviews />
				</div>
			</Grid>
		</Grid>
	);
};

const BotWelcome = () => {
	return (
		<div className="flex-center">
			<Fade in timeout={1100}>
				<DiscordAvatar
					className="lp-avatar"
					alt="Byte-O-Bert logo"
					src={avatar}
				/>
			</Fade>
			<div className="flex-justify-center lp-wrapper">
				<Fade in timeout={500}>
					<span className="lp-medium">Beep boop, I am </span>
				</Fade>
				<Grow in timeout={2000} style={{ transitionDelay: '200ms' }}>
					<span className="lp-large">Byte-O-Bert!</span>
				</Grow>
				<Fade in timeout={1100}>
					<i className="lp-small">
						The most humble & fantaboulistic Discord Bot on this
						website
					</i>
				</Fade>
			</div>
		</div>
	);
};

const Login = () => {
	return (
		<Fade in timeout={1100}>
			<div className="flex-center lp-login">
				<span className="lp-small">Let me serve you</span>
				<Button
					className="lp-login-btn"
					variant="contained"
					startIcon={<LoginIcon />}
					href={`${BACKEND_URL}/api/v1/auth/discord`}
				>
					Login with Discord
				</Button>
				<i className="lp-small">
					The NSA has nothing on my listening skills
				</i>
			</div>
		</Fade>
	);
};

const Reviews = () => {
	// div after Grow is needed for the hover animation of the card to work
	return REVIEWS.map(({ text, author }, index) => (
		<Grow key={index} in timeout={800 + (index + 1) * 300}>
			<div>
				<Card className="lp-review" variant="outlined">
					<CardContent>
						<ListItemText
							primary={text}
							secondary={`-${author}`}
							className="lp-review-text"
						/>
					</CardContent>
				</Card>
			</div>
		</Grow>
	));
};

export default LoginPage;
