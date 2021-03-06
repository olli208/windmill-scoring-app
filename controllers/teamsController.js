var rp = require('request-promise');
var moment = require('moment');
var mongoose = require('mongoose');
var Game = mongoose.model('Game');

exports.getTeamDetail = function (req, res) {
  rp(`http://api.playwithlv.com/v1/teams/${req.params.id}/?access_token=${req.session.accessToken}`)
    .then(function (body) {
      var teamData = JSON.parse(body);

      var games = Game.find({
        $or: [{"team_1.teamID": String(teamData.id)}, {"team_2.teamID": String(teamData.id)}]
      });

      games
        .then(function (games) {
          console.log('DATA for teamdetail page -> ', games)
          var lastGame = new Date(Math.max.apply(null, games.map(function(e) {
            var x = new Date(e.startTime)
            return x
          })));

          var tournamentIDS = games.map(function (obj) {
            return obj.tournamentID
          })

          rp(`http://api.playwithlv.com/v1/games/?tournament_id=${parseInt(tournamentIDS[0])}&team_ids=%5B${teamData.id}%5D&starts_after=${lastGame.toISOString()}&order_by=['start_time']&limit=1&access_token=${req.session.accessToken}`)
            .then(function (body) {
              var nextGames = JSON.parse(body);
              console.log(req.session.return);
            
              res.render('teams-detail', {
                data: teamData,
                games: games || {},
                next: nextGames.objects[0],
                returnto: req.session.return || "/games"
              });

            })
            .catch(function (err) {
              console.log(`error getting TEAM DETAIL GAMES -> ${err}`)
            })
        })
        .catch(function (err) {
          console.log(`Could not find GAMES from DATABASE -> ${err}`)
        })
    })
}