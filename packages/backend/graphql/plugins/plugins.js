import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { is_prod } from '@byte-o-bert/shared/utils/utils';

const plugins = [...(is_prod ? [ApolloServerPluginLandingPageDisabled()] : [])];

export default plugins;
