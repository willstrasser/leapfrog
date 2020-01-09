import Mta from 'mta-gtfs';

console.log('\n\n\n\n\nMTA_API_KEY', process.env.MTA_API_KEY);

export const mtaApi = new Mta({
  key: process.env.MTA_API_KEY,
  feed_id: 1,
});
