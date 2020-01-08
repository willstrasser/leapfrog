import Mta from 'mta-gtfs';

export const mtaApi = new Mta({
  key: process.env.mta_api_key,
  feed_id: 1,
});
