import Mta from 'mta-gtfs';

export const mtaApi = new Mta({
  key: process.env.MTA_API_KEY,
  feed_id: 1,
});
