import abi from "./abi.js";
import openCity from "./tab.js";
const { ethers: etherjs } = ethers;

const rpcUrl = "";
const signerProvider = new etherjs.providers.Web3Provider(window.ethereum);

const provider = new etherjs.providers.JsonRpcProvider(rpcUrl);

const signer = signerProvider.getSigner();

let connectedWallet;
// const tokenContract = async (address, abi, isSigner = false) => {
//   const providerSigner = new etherjs.providers.Web3Provider(window.ethereum);
//   const signer = providerSigner.getSigner();
//   const provider = new etherjs.providers.JsonRpcProvider(rpcUrl);
//   const newProvider = isSigner ? signer : provider;
//   return new ethers.Contract(address, abi, newProvider);
// };

// view functions
// new ethers.Contract(address, abi, provider)

//state  mutating functions
// new ethers.Contract(address, abi, signer)

testFunc();
const connectWallet = async () => {
  await signerProvider.send("eth_requestAccounts");
  await getUserWallet();
};

const getUserWallet = async () => {
  let userAddress = await signer.getAddress();
  connectedWallet = userAddress;
  console.log(connectedWallet, "connected wallet");
};

function testFn(){
    
}
const testFunc = () => {
  console.log("test ran");
};

console.log(abi, etherjs);

export default {
  openCity,
};

// Event Listeners

const button = document.getElementById("connectBtn");
button.addEventListener("click", connectWallet);
