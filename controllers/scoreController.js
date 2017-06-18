var request = require('request');
var moment = require('moment');

exports.updateScore = function (req, res) {
  team1_score = req.body.team1_score;
  team2_score = req.body.team2_score;
  scorer = req.body.scorer;
  assist = req.body.assist;
  gameID = req.body.game_id;
  timeOfUpdate = moment().format();

  console.log(timeOfUpdate);
  // TODO -> request score of this game first
  // Check time of last update compare and update
  // only if this time is more recent and if score is changed at all
  // We post request the score to the api.
  // If we have a mongodb database now is the time to update the score there  also

  var score = {
    'game_id': gameID,
    'team_1_score': team1_score,
    'team_2_score': team2_score,
    // 'what_happened': `scorer: ${scorer} , assist: ${assist}`, // TODO -> store scorer and assist on own db
    'is_final': 'False'
  };

  // TODO First request rurrent score for the game and check date
  // if date is later then the date when this request post is then cancel this post and return message to user.
  request.post({
    url: 'http://api.playwithlv.com/v1/game_scores/',
    headers: {
      'Authorization': `bearer ${req.session.accessToken}`
    },
    json: true,
    body: score
  }, function (err, response, body) {
    console.log(body);
    res.redirect('/games')
  });
}