const express = require("express");

const app = express();

const stripe = require("stripe")(process.env['stripePrivateKey']);
const port = process.env["PORT"] || "4242";



app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const createLocation = async () => {
  const location = await stripe.terminal.locations.create({
    display_name: 'Atelier Informatique et Media',
    address: {
      line1: '65 montée des Lauzes',
      postal_code: '07190',
      city: 'Saint Sauveur de Montagut',
      country: 'FR',
    }
  });
  
  return location;
};

//createLocation().then((value) => console.log(JSON.stringify(value))); 

// The ConnectionToken's secret lets you connect to any Stripe Terminal reader
// and take payments with your Stripe account.
// Be sure to authenticate the endpoint for creating connection tokens.
app.post("/connection_token", async(req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  let connectionToken = await stripe.terminal.connectionTokens.create();
  res.json({secret: connectionToken.secret});
  console.log(`${new Date()}connection token request received : ${connectionToken.secret}`)
})

app.get("/health", async(req, res) => {
  res.status(200);
  res.send(`<html><body>OK</body></html>`)
})

app.post("/create_payment_intent", async(req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  // For Terminal payments, the 'payment_method_types' parameter must include
  // 'card_present'.
  // To automatically capture funds when a charge is authorized,
  // set `capture_method` to `automatic`.

  const intent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'eur',
    payment_method_types: [
      'card_present',
    ],
    capture_method: 'automatic',
    metadata: {order_id: '6735'},
  });
  res.set('Access-Control-Allow-Origin', '*');
  res.json(intent);
});


app.post("/capture_payment_intent", async(req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const intent = await stripe.paymentIntents.capture(req.body.payment_intent_id);
  res.send(intent);
});


app.listen(port, () => console.log('Backend server listening on https://backend.atelier-im.com !'));