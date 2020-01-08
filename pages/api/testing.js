import {mtaApi} from './mtaApi';

export default (req, res) => {
  mtaApi
    .stop()
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      console.log(err);
    });
};
