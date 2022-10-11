const got = require('got');
exports.handler = async function(context, event, callback) {
  const twiml = new Twilio.twiml.MessagingResponse();
  let inbMsg = event.Body.toLowerCase().trim();
  if(inbMsg.includes("bill")) {
    got(`https://api.congress.gov/v3/bill?api_key=${context.CONGRESS_API_KEY}&limit=1`, { json: true }).then(response => {
      let latestActionDate = response.body.bills[0].latestAction.actionDate;
      let latestActionTxt = response.body.bills[0].latestAction.text;
      let title = response.body.bills[0].title;
      let congress = response.body.bills[0].congress;
      let type =  response.body.bills[0].type;
      let number = response.body.bills[0].number;
      twiml.message(`Bill: ${title}.\nAssigned bill or resolution number:${number}\n Latest action was on ${latestActionDate}.\n The bill was ${latestActionTxt}\n Congress ${congress}.\n Type: ${type}.`);
      callback(null, twiml);
    }).catch(error => {
      twiml.message(`${error.response}`);
      callback(null, twiml);
    });
  }
  // else if(inbMsg.includes("amendment")) {
  //   superagent.post(`https://api.congress.gov/v3/amendment`)
  //   .set('Authorization', `Bearer ${context.CONGRESS_API_KEY}`)
  //   .set('Content-Type', 'application/json')
  //   .then((res) => {
  //     twiml.message(`${res.amendments[0]} is the most recent amendment worked on.`);
  //     callback(null, twiml);
  //   })
  //   .catch(err => {
  //     twiml.message(`Error: ${err.message}`);
  //     callback(null, twiml);
  //   });
  // }
  // else if(inbMsg.includes("congress")) {
  //   superagent.post(`https://api.congress.gov/v3/congress`)
  //   .set('Authorization', `Bearer ${context.CONGRESS_API_KEY}`)
  //   .set('Content-Type', 'application/json')
  //   .then((res) => {
  //     twiml.message(`${res.congress[0]} is the most recent congress`);
  //     callback(null, twiml);
  //   })
  //   .catch(err => {
  //     twiml.message(`Error: ${err.message}`);
  //     callback(null, twiml);
  //   });
  // }
  // else if(inbMsg.includes("member")) {
  //   superagent.post(`https://api.congress.gov/v3/member`)
  //   .set('Authorization', `Bearer ${context.CONGRESS_API_KEY}`)
  //   .set('Content-Type', 'application/json')
  //   .then((res) => {
  //     twiml.message(`${res.member[0]} is the most recent members worked on.`);
  //     callback(null, twiml);
  //   })
  //   .catch(err => {
  //     twiml.message(`Error: ${err.message}`);
  //     callback(null, twiml);
  //   });
  // }
  else {
    twiml.message(`Send "bill", "amendment", "congress", or "member"`);
    callback(null, twiml);
  }
};
