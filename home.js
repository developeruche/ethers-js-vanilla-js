// This script would handle the affairs of the home page
import abi from "./abi.js";
const { ethers: etherjs } = ethers;



const rpcUrl = "https://goerli.infura.io/v3/ba80361523fe423bb149026a490266f0";
const signerProvider = new etherjs.providers.Web3Provider(window.ethereum); // this provider would be useful for maing right operation
const provider = new etherjs.providers.JsonRpcProvider(rpcUrl);
const signer = signerProvider.getSigner();


// making the application access the blockchain

const token__address = [
    "0x6339852c28edbe32184d1d6a34381eb8818928e7",
    "0x46545d87675163f699487e96c830ac80729b7fd0",
    "0x62c75e3decfae022423a4df382975e05931a6f6e",
    "0x543b5ceacc760fdcb5039deb7f271a49f54c4fcc",
    "0xfcc68585a5a33872d4edf2131fe97d2bde372a29"
];

const useContract = (
    address,
    contractAbi,
    isSigner = false
  ) => {
    const providerSigner = new etherjs.providers.Web3Provider(window.ethereum);
    const signer = providerSigner.getSigner();
    const provider = new etherjs.providers.JsonRpcProvider(rpcUrl);
    const newProvider = isSigner ? signer : provider;
    return new ethers.Contract(address, contractAbi, newProvider);
  };

  
// This function would connect metamask
const connectWallet = async () => {
    await signerProvider.send("eth_requestAccounts");
    await getUserWallet();
  };

  function updateUserAddress(address) {
    document.getElementById("connect-btn").innerText = address;
  }


// Using this you would be able to get the address of the connected user
const getUserWallet = async () => {
    let userAddress = await signer.getAddress();
    updateUserAddress(userAddress);
    return userAddress;
  };
  

  async function getTokenDetails() {
    document.getElementById("loading").innerText = "Loading...";

    let prepData = [];

    for(let i = 0; i < token__address.length; i++) {
        const token = await useContract(token__address[i], abi);
        try {
          const [name, symbol, totalSupply, bal] = await Promise.all([
            token.name(),
            token.symbol(),
            token.totalSupply(),
            token.balanceOf(getUserWallet())
          ]);
          prepData.push({ name, symbol, totalSupply: Number(totalSupply), bal: Number(bal) });
        } catch (error) {
          errored.innerText = "Error Occurred!";
          console.log("error occurred", error);
        } finally {
            document.getElementById("loading").innerText = "";
        }
    }

    return prepData;
  }



// Implementation 
document.getElementById("connect-btn").addEventListener("click", connectWallet);


function generateTemplate(name, symbol, totalSupply, bal, index) {
    return `
        <div class="token__mainlist__item">
            <div class="token__mainlist__item__header">
            <input type="text" className="address__input" id="addres__input_${index}" placeholder="Enter Address">
            <input type="text" className="address__input" id="amount__input_${index}" placeholder="Enter Amount">
            <button id="send__button_${index}">Send</button>
            </div>
            <div class="token__mainlist__body">
            <div class="token__mainlist__body__item">
                <h3 id="token__name">Name</h3>
                <h3 id="token__sy">Symbol</h3>
                <h3 id="token__tot__suh3">Total supply</h3>
                <h3 id="token__user__bal">User balance</h3>
            </div>

            <div class="token__mainlist__body__item">
                <h3 id="token__name token__name_${index}">${name}</h3>
                <h3 id="token__sy token__sy_${index}">${symbol}</h3>
                <h3 id="token__tot__sup token__tot__sup_${index}">${totalSupply}</h3>
                <h3 id="token__user__bal token__user__bal_${index}">${bal}</h3>
            </div>
            </div>
        </div>
    `
}

function SendToken() {
    const btns = [  document.getElementById("send__button_0"),
                    document.getElementById("send__button_1"),
                    document.getElementById("send__button_2"),
                    document.getElementById("send__button_3"),
                    document.getElementById("send__button_4")];

    for(let i = 0; i < btns.length; i++) {
        console.log(btns[i])

        btns[i].addEventListener("click", async () => {
            await ex(i)
        });
    }
}



async function InitData() {
    const prep_data = await getTokenDetails();

    console.log(prep_data)

    for (let i = 0; i < prep_data.length; i++) {
        const template = generateTemplate(prep_data[i].name, prep_data[i].symbol, prep_data[i].totalSupply / 10 ** 18, prep_data[i].bal, i);
        const node = document.createElement("div");
        node.innerHTML = template;
        document.getElementById("token__mainlist").appendChild(node);
    }

    SendToken()
  }

InitData();
  


async function ex(index) {
    let address = document.getElementById(`addres__input_${index}`).value;
    let amount = document.getElementById(`amount__input_${index}`).value;
    const token = await useContract(token__address[index], abi, true);
    const parseUnit = etherjs.utils.parseEther(amount);
    const txn = await token.transfer(address, parseUnit);
    console.log(txn, "transaction pending....");
    document.getElementById("sending").innerHTML = "Sending... :)";
    window.alert(`transaction pending....`);
    const confirm = await txn.wait();
    console.log("transaction ends", confirm);
    window.alert(`${amount} Token sent to ${address}`);
    document.getElementById("sending").innerText = "Send";
}




// document.getElementById("enable").addEventListener("click", SendToken)

// 0x1f04543B012C0851f23fdfFd824293270a660De9


