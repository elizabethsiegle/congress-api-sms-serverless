exports.handler = async (context, event, callback) => {
  const { request } = await import('undici');
  const inbMsg = event.Body.toLowerCase().trim();
  const twiml = new Twilio.twiml.MessagingResponse();
  if(inbMsg.includes("bill")) {
    const {
      body
    } = await request(`https://api.congress.gov/v3/bill?api_key=${context.CONGRESS_API_KEY}`);
    const data = await body.json();
    const billsLength = data.bills.length;
    const randNum = Math.floor(Math.random() * (billsLength - 1)) + 1;
    const bill = data.bills[randNum];
    const { latestAction, title, type, number, originChamber } = bill;
    
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
    twiml.message(`Bill: ${title}.\nType: ${billMap[type]}\nAssigned bill or resolution number: ${number}\nIt originated in the ${originChamber} but the latest action was ${latestAction.text} on ${latestAction.actionDate}`);
  }
  else if(inbMsg.includes("amendment")) {
    const {
      body
    } = await request(`https://api.congress.gov/v3/amendment?api_key=${context.CONGRESS_API_KEY}`);
    const data = await body.json();
    const amendmentLength = data.amendments.length;
    const randNum = Math.floor(Math.random() * (amendmentLength - 1)) + 1;
    const amendment = data.amendments[randNum];
    const { latestAction, purpose, congress, number } = amendment;
    twiml.message(`Amendment purpose: ${purpose}\nAssigned amendment or resolution number:${number}\n Latest action was on ${latestAction.actionDate} to ${latestAction.text}.\n Congress: ${congress}.`);
  }
  else if(inbMsg.includes("summaries")) {
    const CURRENT_CONGRESS = 117;
    const {
      body
    } = await request(`https://api.congress.gov/v3/summaries/${CURRENT_CONGRESS}?api_key=${context.CONGRESS_API_KEY}`);
    const data = await body.json();
    const sumLength = data.summaries.length;
    const randNum = Math.floor(Math.random() * (sumLength - 1)) + 1;
    const summaries = data.summaries[randNum];
    const { bill, currentChamber, text, actionDate, actionDesc } = summaries;
    const regexToStripHtmlTags = /<(.|\n)*?>/g;
    const textWithoutHtmlTags = text.replace(regexToStripHtmlTags, '');
    const msg = `Summary title: ${bill.title}.\nStarted in: ${bill.originChamber} on ${actionDate}, currently in the ${currentChamber} chamber in Congress ${bill.congress} and it was ${actionDesc}\n${textWithoutHtmlTags}`; 
    twiml.message(msg);
  }
  else {
    twiml.message(`Send "bill", "amendment", or "summaries"`);
  }
  callback(null, twiml);
};