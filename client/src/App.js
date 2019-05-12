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

    // // initial deposit
    await contract.methods.deposit().send({
      from: accounts[0],
      value: this.state.web3.utils.toWei('10', 'ether')
    });
    
    // // check balance is kosher
    const res = await contract.methods.balanceOf(accounts[0]).call();
    const balance = this.state.web3.utils.fromWei(res._hex)
    console.log(`balance: ${balance}`)
    
    // Create payrool,, check its lit 
    const response = await contract.methods.createNewPayroll().call();
    const payrollId = response.toNumber()
    console.log(`payrollId: ${payrollId}`)
    
    this.createEmployee('0xf104cb0b57ee274838f43399f2ede8cc8e428560', 2, 'jeff')
  }

  createEmployee = async(employeeAddress, hourlyRate, name) => {
    console.log('createEmployee')
    const { accounts, contract } = this.state;

    const res1 = await contract.methods.createEmployee(employeeAddress, hourlyRate, name).send({
      from: accounts[0]
    });
    console.log(res1)
    console.log('res1')
    const res = await contract.methods.employees(1).call()
    console.log(res)
    console.log('end')
  }

  addEmployeeToPayroll = async(employeeId, hoursWorked) => {
    console.log('addEmployeeToPayroll')
    const { accounts, contract } = this.state;
    // function addEmployeeToPayroll(uint _employee_id, uint _hours_worked) public {

    const res = await contract.methods.addEmployeeToPayroll(employeeId, hoursWorked).send({
      from: accounts[0]
    });

    console.log('res')
    console.log(res)
  }

  updateHoursWorked = async(employeeId, hoursWorked) => {
    console.log('updateHoursWorked')
    const { accounts, contract } = this.state;
    // function updateHoursWorked(uint _employee_id, uint _hours_worked) public {

    await contract.methods.updateHoursWorked(employeeId, hoursWorked).send({
      from: accounts[0]
    });
  }

  runPayroll = async() => {
    console.log('runPayroll')
    const { accounts, contract } = this.state;

    await contract.methods.runPayroll()
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
         <div>
          <button
            onClick={() => this.addEmployeeToPayroll(1, 2)}
          >
            Add Employee 1 to payroll
          </button>
        </div>

        <div>Current Payroll number: {this.state.currentPayrollId}</div>

        <div>
          <button
            onClick={() => this.runPayroll()}
          >
            Run Payroll
          </button>
        </div>
      </div>
    );
  }
}

export default App;
