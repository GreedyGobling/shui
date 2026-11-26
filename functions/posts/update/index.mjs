import { sendResponse } from '../../../responses/index.mjs';

export const handler = async () => sendResponse(501, { error: 'wip' });
