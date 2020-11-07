import createError from 'http-errors';
import { getEndedAuctions } from '../lib/get-ended-auctions';
import { closeAuction } from '../lib/close-auction';

const processAutions = async () => {
  try {
    const auctionsToClose = await getEndedAuctions();
    if (!auctionsToClose) return { closed: 0 };
    const promises = auctionsToClose.map(({ id }) => closeAuction(id));
    await Promise.all(promises);
    return { closed: promises.length };
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
};

export const handler = processAutions;
