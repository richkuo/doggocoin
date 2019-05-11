import React, { Component } from "react";
import PayrollContract from "./contracts/PayrollContract.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = { currentPayrollId: 999999999, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PayrollContract.networks[networkId];
      const instance = new web3.eth.Contract(
        PayrollContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.createPayroll);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getCurrentPayrollId = async () => {
    const { accounts, contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getCurrentPayroll().call();
    console.log(response.toNumber());
  };

  createPayroll = async () => {
    const { accounts, contract } = this.state;

    var params = {
      gas: 40000,
      from: accounts[0]
      // value: this.state.web3.utils.toWei('1', 'ether')
      // value: 1
    };

    console.log(params)

    // await contract.methods.deposit(params).send({ from: accounts[0] });
    await contract.methods.deposit(1).send(params);
    const response = await contract.methods.createNewPayroll().call();

    // Get the value from the contract to prove it worked.
    console.log(response.toNumber());

    this.setState({ currentPayrollId: response.toNumber() });
  };

  createEmployee = async() => {
    const { accounts, contract } = this.state;

    await contract.methods.addEmployeeToPayroll;
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>Current Payroll number: {this.state.currentPayrollId}</div>
      </div>
    );
  }
}

export default App;
