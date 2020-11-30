import {createLogger} from '../utils/logger';
import {JwtPayload} from './JwtPayload';
import {decode} from 'jsonwebtoken';


const logger = createLogger('utils');

export const getAuthToken = (authHeader: string): string => {
	logger.info('Running getAuthToken function.');
  if (!authHeader) throw new Error('No authentication header');

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header');

  const actualToken = authHeader.split(' ');
  const authToken = actualToken[1];

  return authToken;
}

/*
The above function can be used to get the authToken from Headers
*/


/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
	logger.info('parseUserId function on backend is running');
  const jwtDecoded = decode(jwtToken) as JwtPayload
  return jwtDecoded.sub
}
