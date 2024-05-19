import { guildCommandSearchVar } from '../../graphql/reactiveVars/guildVars';
import {
	eligibleGuildSearchVar,
	mutualGuildSearchVar,
} from '../../graphql/reactiveVars/userGuildVars';

export const clickHandler = () => {
	// reset search vars
	guildCommandSearchVar('');
	mutualGuildSearchVar('');
	eligibleGuildSearchVar('');
};
