require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const { ethers } = require("ethers");
const abi = require("./abi.json");
const colorIndex = require("./colorIndex.json");

const contract = "0x91644644403a5a13C5198D8DaD89247902D2216E";
const rpc = "https://testnet.emerald.oasis.dev";
const url = "https://raw.githubusercontent.com/oasis-stack/data/main/json/int.json";

main();
async function main() {
  const colors = await axios.get(url).then((res) => res.data); // [15871728, 7568050]
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const erc721 = new ethers.Contract(contract, abi, wallet);
  for (let i = colorIndex; i < colors.length; i++) {
    fs.writeFileSync(`./colorIndex.json`, i);
    await erc721["ownerMint"](colors[i], `https://raw.githubusercontent.com/oasis-stack/data/main/json/${colors[i]}.json`);
    console.log("minted", colors[i]);
    await new Promise((resolve) => setTimeout(resolve, 20000));
  }
}
