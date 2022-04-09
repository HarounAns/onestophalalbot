require("dotenv").config();
const { fetchWagyuItems } = require("./onestophalalWagyuScrape");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const botNum = process.env.TWILIO_BOT_NUMBER;
const testRecipient = process.env.RECIPIENT_NUMBER;

const TOMAHAWK = "full-blood-wagyu-tomahawk-steak";
const SOLD_OUT = "Sold Out";
const ONESTOP_HALAL_URL = "https://onestophalal.com/products";

// MVP: only tells you if fullblood tomahawk wagyu is in stock
module.exports.oneStopHalalAlert = async () => {
  const wagyuItems = await fetchWagyuItems();
  console.log("TOMAHAWK", wagyuItems[TOMAHAWK]);

  let tomahawkInStock = false;
  for (const key in wagyuItems[TOMAHAWK]) {
    if (wagyuItems[TOMAHAWK][key] !== SOLD_OUT) {
      tomahawkInStock = true;
      break;
    }
  }

  if (!tomahawkInStock) {
    console.info("Tomahawk is not in stock");
    return;
  }

  // TODO: handle alerts using Dynamo
  console.info("TOMAHAWK IS IN STOCK!!!");
  const message = await client.messages.create({
    from: botNum,
    body: `Full Blood Wagyu Tomahawk Steak is now in stock: ${ONESTOP_HALAL_URL}/${TOMAHAWK}`,
    to: testRecipient,
  });
  console.log("message sent to ", testRecipient, message.sid);
};
