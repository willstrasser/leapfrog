import {mtaApi} from './mtaApi';

export default (req, res) => {
  mtaApi
    .schedule(122)
    .then(function(result) {
      res.json(result.schedule['122'].N);
    })
    .catch(function(err) {
      console.log('errrrrrr', err);
      res.json('whoos', err);
    });
};
