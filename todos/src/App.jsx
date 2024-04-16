import { useEffect, useState, useCallback } from "react";
import "./App.css";
import { ethers } from "ethers";
import { address, abi } from "./config";
import { Todos } from "./components/Todos";
import { AddTodo } from "./components/AddTodo";
import { Header } from "./components/Header";
import { Clock } from "./components/Clock";

if (window.ethereum) {
  window.provider = new ethers.BrowserProvider(window.ethereum);
} else {
  console.error(
    "Ethers.js: Web3 provider not found. Please install a wallet with Web3 support."
  );
}

function App() {
  const [wallet, setWallet] = useState({
    accounts: [],
    balance: "",
  });
  const [readContract, setReadContract] = useState();
  const [writeContract, setWriteContract] = useState();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getProvider = async () => {

      const todoReadContract = new ethers.Contract(
        address,
        abi,
        window.provider
      );
      
      setReadContract(todoReadContract);
      const signer = await window.provider.getSigner();
      const todoWriteContract = new ethers.Contract(address, abi, signer);
   
      setWriteContract(todoWriteContract);
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      updateWallet(accounts);
    };

    getProvider();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const populateTodos = useCallback(async () => {
    const indexes = await readContract["todoCount"]();
    const count = Number(indexes);

    console.log("Count:", count);
  
    let temp = [];
    for (let i = 1; i <= count; i++) { 
      const todo = await readContract["todos"](i);
      if (todo.id > 0) {
        temp.push(todo);
      }
    }
    
    setTodos(temp);
}, [readContract]);

  useEffect(() => {
  
    if (wallet && readContract) {
      populateTodos();
    }
  }, [wallet, readContract, populateTodos]);

  const updateWallet = async (accounts) => {
    const balance = formatBalance(
      await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
    );
    setWallet({
      accounts,
      balance,
    });
  };

  const formatBalance = (rawBalance) => {
    const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(5);
    return balance;
  };

  return (
    <>
    <Header className="header" />
      {wallet?.accounts.length > 0 && (
        <>
          <div className="wallet">Wallet Accounts: {wallet.accounts[0]}</div>
          <p className="balance">Balance: {wallet.balance} ETH</p>
        </>
      )}

      <AddTodo className="add-todo"
      writeContract={writeContract} 
      populateTodos={populateTodos} />

      <Todos className="todos"
      todos={todos} 
      contract={writeContract} 
      populateTodos={populateTodos} />

      <div className="clock-container">
  <Clock className="clock"/>
      </div>
    </>
  );
}

export default App;