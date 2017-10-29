"use strict";

const express = require('express');
const pollsRoutes  = express.Router();

var api_key = 'key-a2cf31de4910b2743d7a19585c3f4c85';
var domain = 'sandboxcc6313cdfcfd4c37a39123dd094ce1ab.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

module.exports = function(dataHelpers) {

  pollsRoutes.get("/:id", function(req, res) {
    const pollId = req.params.id;
    dataHelpers.getPoll(pollId, (err, poll) => {
    var templateVars = {
      poll: poll,
      id: pollId
    }
    console.log(templateVars.poll)
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).render('polls_id', templateVars)
      }
    });
  }),



// to VOTE
  pollsRoutes.post("/:id", function (req, res) {
    let pollId = req.params.id;
    let pollObj = req.body;
    let pollOpt = pollObj.options;
    let link = "/polls/"+ pollId
    var data = {
      from: 'Dilan <dilannebioglu@gmail.com>',
      to: 'nebiogludilan@gmail.com',
      subject: 'Hello from Decision Maker',
      html: 'Somebody just voted! You can checkout the current results from your profile! <a href = link>Your profile link</a> Have a good day!'
    };

    pollOpt.forEach(function(opt){
      dataHelpers.addVotes(opt, (err, result)=> {
        if (err) {
          res.status(500).json({ error: err.message });
          return
        }
      })
    })
    mailgun.messages().send(data, function(error, body) {
      console.log('email');
      console.log(body);
    });
      res.status(200)
  })

return pollsRoutes;
}
