import twilio from 'twilio';
import moment from 'moment';
import {mtaApi} from '../mtaApi';

export default (request, response) => {
  const {stopId} = request.query;
  const stopIds = stopId.split(',');
  const durations = [0, 80, 7.9 * 60, 0];
  const contraints = [['1'], ['1', '2', '3'], ['1'], ['1']];
  mtaApi
    .schedule(stopIds)
    .then(function(result) {
      const paths = [];
      const arrOfArrivals = stopIds.map((stopId) =>
        result.schedule[stopId].S.map((arrival) => arrival)
      );
      function makeTransfer(path, i) {
        if (i === arrOfArrivals.length) {
          const departureTime = path[0].arrivalTime;
          const destinationTime = path[path.length - 1].arrivalTime;
          const duration = destinationTime - departureTime;
          paths.push({
            departureTime,
            destinationTime,
            duration,
            path,
          });
          return;
        }
        arrOfArrivals[i].forEach((arrival) => {
          if (
            !path.length ||
            (path[path.length - 1].arrivalTime + durations[i] < arrival.arrivalTime &&
              contraints[i].includes(arrival.routeId))
          ) {
            makeTransfer([...path, arrival], i + 1);
          }
        });
      }
      makeTransfer([], 0);
      const now = Date.now();
      const sorted = paths
        .filter((path) => path.departureTime * 1000 > now)
        .sort((a, b) => a.duration - b.duration)
        .sort((a, b) => a.destinationTime - b.destinationTime);

      if (request.query.sendSms) {
        const authToken = process.env.TWILIO_ACCOUNT_AUTH;
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const smsFromNumber = '2058130632';
        const smsToNumber = '6102915090';
        const twilioClient = twilio(accountSid, authToken);
        twilioClient.messages.create({
          body: `Next duration:${moment(sorted[0].duration * 1000).format('m:ss')}`,
          from: `+1${smsFromNumber}`,
          to: `+1${smsToNumber}`,
        });
      }

      response.json({arrivals: result, paths: sorted.slice(0, 10)});
    })
    .catch(function(err) {
      throw err;
    });
};
