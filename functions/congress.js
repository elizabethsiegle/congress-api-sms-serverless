const got = require('got');
exports.handler = async function(context, event, callback) {
  const twiml = new Twilio.twiml.MessagingResponse();
  let inbMsg = event.Body.toLowerCase().trim();
  if(inbMsg.includes("bill")) {
    got(`https://api.congress.gov/v3/bill?api_key=${context.CONGRESS_API_KEY}`, { json: true }).then(response => {
      let billsLength = response.body.bills.length;
      let randNum = Math.floor(Math.random() * (billsLength - 1)) + 1;
      let latestActionDate = response.body.bills[randNum].latestAction.actionDate;
      let latestActionTxt = response.body.bills[randNum].latestAction.text;
      let title = response.body.bills[randNum].title;
      let congress = response.body.bills[randNum].congress;
      let type =  response.body.bills[randNum].type;
      let num = response.body.bills[randNum].number;
      let originChamber = response.body.bills[randNum].originChamber;
      const billMap = {
        HR: "house bill", 
        S: "senate bill",
        HJRES: "house joint resolution",
        SJRES: "senate joint resolution",
        HCONRES: "house concurrent resolution",
        SCONRES: "senate concurrent resolution",
        HRES: "house simple resolution",
        SRES: "senate simple resolution"
      };
      let msg = `Bill: ${title}.\nType: ${billMap[type]}\nAssigned bill or resolution number: ${num}\nIt originated in the ${originChamber} but the latest action was ${latestActionTxt} on ${latestActionDate}`;
    //   got(`https://api.congress.gov/v3/bill/${congress}/${type}/${num}/summaries?api_key=${context.CONGRESS_API_KEY}`, { json: true }).then(resp => {
    //     msg += resp.summaries.text;
    // });
    twiml.message(msg);
      callback(null, twiml);
    }).catch(error => {
      twiml.message(`${error.response}`);
      callback(null, twiml);
    });
  }
  else if(inbMsg.includes("amendment")) {
    got(`https://api.congress.gov/v3/amendment?api_key=${context.CONGRESS_API_KEY}`, { json: true }).then(response => {
      let amendmentLength = response.body.amendments.length;
      let randNum = Math.floor(Math.random() * (amendmentLength - 1)) + 1;
      let latestActionDate = response.body.amendments[randNum].latestAction.actionDate;
      let latestActionTxt = response.body.amendments[randNum].latestAction.text;
      let purpose = response.body.amendments[randNum].purpose;
      let congress = response.body.amendments[randNum].congress;
      let type =  response.body.amendments[randNum].type;
      let number = response.body.amendments[randNum].number;
      twiml.message(`Amendment purpose: ${purpose}.\nAssigned amendment or resolution number:${number}\n Latest action was on ${latestActionDate}.\n The bill was ${latestActionTxt}\n Congress: ${congress}.`);
      callback(null, twiml);
    });
  }
  else {
    twiml.message(`Send "bill", "amendment", or "summaries"`);
    callback(null, twiml);
  }
};