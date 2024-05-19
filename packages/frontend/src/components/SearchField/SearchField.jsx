import { useReactiveVar } from '@apollo/client';
import Input from '@mui/material/Input';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import './searchField.css';

const SearchField = ({
	searchVar,
	label,
	func,
	clearFunc,
	details = undefined,
	clearButtonDetails = undefined,
	className,
	...props
}) => {
	const value = useReactiveVar(searchVar);

	return (
		<Input
			className={`searchfield-input${className ? ` ${className}` : ''}`}
			placeholder={label}
			onChange={func}
			value={value}
			name={details}
			startAdornment={<SearchIcon className="searchfield-icon" />}
			endAdornment={
				!!value ? (
					<IconButton
						className="searchfield-icon"
						onClick={clearFunc}
						size="small"
						name={details}
					>
						<ClearIcon />
					</IconButton>
				) : undefined
			}
			autoComplete="off"
			{...props}
		/>
	);
};

export default SearchField;
