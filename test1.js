const bitboxSDK = require("bitbox-sdk").BITBOX;
const BITBOX = new bitboxSDK();
const { json } = require("body-parser");
const fs = require("fs");

(async () => {
  try {
    let transaction = await BITBOX.Address.transactions(
      "bitcoincash:qqgxtf398496q8c52yplgqlcax6tddjcfsscm3e8wk"
    );
    //https://github.com/Bitcoin-com/bitbox-sdk/blob/master/docs/address.md#transactions
    console.log(transaction);
    fs.writeFileSync("transactions.json", JSON.stringify(transaction, null, 2));
  } catch (error) {
    console.error(error);
  }
})();
