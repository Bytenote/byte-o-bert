import githubLogo from '../../assets/github-mark-white.svg';
import './footer.css';

const Footer = () => {
	return (
		<footer className="footer">
			<div className="content">
				<a
					className="footer-link"
					href="https://github.com/bytenote/byte-o-bert"
					target="_blank"
					rel="noreferrer"
				>
					<img src={githubLogo} alt="GitHub Logo" />
					Source
				</a>
			</div>
		</footer>
	);
};

export default Footer;
