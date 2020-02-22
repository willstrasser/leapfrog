import {mtaApi} from '../mtaApi';

export default (request, response) => {
  const {stopId} = request.query;
  const stopIds = stopId.split(',');
  const durations = [0, 100, 10 * 60, 0];
  mtaApi
    .schedule(stopIds)
    .then(function(result) {
      const paths = [];
      const arrOfArrivals = stopIds.map((stopId) =>
        result.schedule[stopId].S.map((arrival) => arrival.arrivalTime)
      );
      function makeTransfer(path, i) {
        if (i === arrOfArrivals.length) {
          paths.push(path);
          return;
        }
        arrOfArrivals[i].forEach((arrival) => {
          if (!path.length || path[path.length - 1] + durations[i] < arrival) {
            makeTransfer([...path, arrival], i + 1);
          }
        });
      }
      makeTransfer([], 0);
      const sorted = paths.sort((a, b) => {
        return a[a.length - 1] - b[b.length - 1];
      });
      response.json({arrivals: result, paths: sorted.slice(0, 10)});
    })
    .catch(function(err) {
      throw err;
    });
};
