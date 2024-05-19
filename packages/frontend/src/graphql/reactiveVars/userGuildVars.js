import { makeVar } from '@apollo/client';

const initialMutualGuildSearchState = '';
const initialEligibleGuildSearchState = '';

export const mutualGuildSearchVar = makeVar(initialMutualGuildSearchState);
export const eligibleGuildSearchVar = makeVar(initialEligibleGuildSearchState);
