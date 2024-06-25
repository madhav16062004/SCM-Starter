import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [amt, setAmt] = useState(0);
  const [sender,senderadd] = useState(undefined);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account[0]); // Get the first account
    } else {
      console.log("No account found");
    }
  }

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  }
  
  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
    console.log(atm)
  }

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(amt);
      await tx.wait();
      getBalance();
    }
  }

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(amt);
      await tx.wait();
      getBalance();
    }
  }

  const transfer = async () => {
    if (atm) {
      let tx = await atm.transfer(sender,amt);
      await tx.wait();
      getBalance();
    }
  }

  

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p className="p-2">Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return<div className="flex flex-col items-center justify-center space-y-6">
      <p className="font-bold text-white text-3xl">Welcome to the Metacrafters ATM!</p>
        
        <button className="text-center text-black bg-white m-4 px-4 py-4 rounded-lg font-bold hover:bg-gradient-to-br from-gray-900 via-teal-900 to-green-900 hover:text-white" onClick={connectAccount}>Please connect your Metamask wallet</button>
      </div> }

    if (balance == undefined) {
      getBalance();
    }


    return (
      <div className="flex flex-col items-start justify-center text-gray-800 space-y-6 bg-white px-8 py-8 rounded-xl">
      <p className="font-bold text-teal-800 text-3xl">Welcome to the Metacrafters ATM!</p>
        <p className="text-teal-800 font-bold">Your Account: <span className="text-black">{account}</span></p>
        <p className="text-teal-800 font-bold">Your Balance: <span className="text-black">{balance}</span></p>
        <p className="flex flex-row items-start justify-items-start text-teal-800 font-bold">Set Amount: <span className="text-black"></span></p>
        <input className="rounded-lg p-2 w-full text-black border-2 border-teal-800 " type="number" value={amt} onChange={(e)=>setAmt(e.target.value)}></input>
        <p className="flex flex-row items-start justify-items-start text-teal-800 font-bold">Receiver account: <span className="text-black"></span></p>
        <input className="rounded-lg p-2 w-full text-black border-2 border-teal-800 " type="string" value={sender} onChange={(e)=>senderadd(e.target.value)}></input>
        <div className="flex flex-row w-full space-x-4">
        <button className="p-4 bg-teal-800 text-white rounded-lg font-bold w-full" onClick={deposit}>Deposit</button>
        <button className="p-4 bg-teal-800 text-white rounded-lg font-bold w-full" onClick={withdraw}>Withdraw</button>
        <button className="p-4 bg-teal-800 text-white rounded-lg font-bold w-full" onClick={transfer}>transfer</button>
        </div>
      </div>
    )
  }

  useEffect(() => { getWallet(); }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-teal-900 to-green-900 h-screen p-8 flex items-center flex-col justify-center space-y-8">
      {initUser()}
    </div>
  )
}


