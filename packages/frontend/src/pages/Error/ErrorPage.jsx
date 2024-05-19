import { Fragment } from 'react';
import { ERROR_MESSAGES } from './error.constants';
import './error.css';

/**
 * Component that displays the error page.
 *
 * @returns {JSX.Element}
 */
export const ErrorPage = () => {
	return (
		<div className="content-container error-container">
			<div className="content-inner-container">
				<p className="flex-center">404 - Page not found</p>
				<ErrorMessage />
			</div>
		</div>
	);
};

/**
 * Component that displays a random error message.
 *
 * @returns {JSX.Element}
 */
export const ErrorMessage = () => {
	const randomIndex = Math.floor(Math.random() * ERROR_MESSAGES.length);
	const { message, parts, partsStyling, ...props } =
		ERROR_MESSAGES[randomIndex];

	if (parts) {
		return (
			<p className="flex-center error-desc">
				{parts.map((part, index) => {
					const styles = {
						...(partsStyling?.[index]?.styles ?? {}),
					};

					return (
						<Fragment key={index}>
							<span key={index} style={styles} {...props}>
								{part}
							</span>
							&nbsp;
						</Fragment>
					);
				})}
			</p>
		);
	}

	return <p className="flex-center error-desc">{message}</p>;
};

export default ErrorPage;
