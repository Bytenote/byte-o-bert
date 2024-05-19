import CircularProgress from '@mui/material/CircularProgress';
import './loading.css';

const Spinner = ({ message = null, ...props }) => {
	return (
		<div {...props}>
			<div className="component-loading-div flex-center ">
				<CircularProgress />
			</div>
			{message && (
				<div className="loading-content flex-justify-center ">
					{message}
				</div>
			)}
		</div>
	);
};

export default Spinner;
