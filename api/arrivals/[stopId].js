import {mtaApi} from '../mtaApi';

export default (request, response) => {
  const {stopId} = request.query;
  const stopIds = stopId.split(',');
  const durations = [0, 80, 7 * 60, 0];
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
          paths.push(path);
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
      const sorted = paths.sort((a, b) => {
        return a[a.length - 1].arrivalTime - b[b.length - 1].arrivalTime;
      });
      const sortedAgain = sorted.sort((a, b) => {
        return (
          a[a.length - 1].arrivalTime -
          a[0].arrivalTime -
          (b[b.length - 1].arrivalTime - b[0].arrivalTime)
        );
      });
      response.json({arrivals: result, paths: sortedAgain.slice(0, 10)});
    })
    .catch(function(err) {
      throw err;
    });
};
