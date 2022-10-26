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
    const latestActionDate = data.bills[randNum].latestAction.actionDate;
    
    const latestActionTxt = data.bills[randNum].latestAction.text;
    const title = data.bills[randNum].title;
    const congress = data.bills[randNum].congress;
    const type = data.bills[randNum].type;
    const num = data.bills[randNum].number;
    const originChamber = data.bills[randNum].originChamber;
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
    twiml.message(`Bill: ${title}.\nType: ${billMap[type]}\nAssigned bill or resolution number: ${num}\nIt originated in the ${originChamber} but the latest action was ${latestActionTxt} on ${latestActionDate}`);
  }
  else if(inbMsg.includes("amendment")) {
    const {
      body
    } = await request(`https://api.congress.gov/v3/amendment?api_key=${context.CONGRESS_API_KEY}`);
    const data = await body.json();
    const amendmentLength = data.amendments.length;
    const randNum = Math.floor(Math.random() * (amendmentLength - 1)) + 1;
    const latestActionDate = data.amendments[randNum].latestAction.actionDate;
    const latestActionTxt = data.amendments[randNum].latestAction.text;
    const purpose = data.amendments[randNum].purpose;
    const congress = data.amendments[randNum].congress;
    const type =  data.amendments[randNum].type;
    const number = data.amendments[randNum].number;
    twiml.message(`Amendment purpose: ${purpose}\nAssigned amendment or resolution number:${number}\n Latest action was on ${latestActionDate}.\n The bill was ${latestActionTxt}\n Congress: ${congress}.`);
  }
  else if(inbMsg.includes("summaries")) {
    const CURRENT_CONGRESS = 117;
    const {
      body
    } = await request(`https://api.congress.gov/v3/summaries/${CURRENT_CONGRESS}?api_key=${context.CONGRESS_API_KEY}`);
    const data = await body.json();
    const sumLength = data.summaries.length;
    const randNum = Math.floor(Math.random() * (sumLength - 1)) + 1;
    const currentChamber = data.summaries[randNum].currentChamber;
    const billCongressNum = data.summaries[randNum].bill.congress;
    const originChamber = data.summaries[randNum].bill.originChamber;
    const billTitle = data.summaries[randNum].bill.title;
    let text = data.summaries[randNum].text;
    const regexToStripHtmlTags = /<(.|\n)*?>/g;
    const textWithoutHtmlTags = text.replace(regexToStripHtmlTags, '');
    const actionDate = data.summaries[randNum].actionDate;
    const actionDesc = data.summaries[randNum].actionDesc;
    const msg = `Summary title: ${billTitle}.\nStarted in: ${originChamber} on ${actionDate}, currently in the ${currentChamber} chamber in Congress ${billCongressNum} and it was ${actionDesc}\n${textWithoutHtmlTags}`;
    twiml.message(msg);
  }
  else {
    twiml.message(`Send "bill", "amendment", or "summaries"`);
  }
  callback(null, twiml);
};