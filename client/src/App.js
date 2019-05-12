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
      value: this.state.web3.utils.toWei('2', 'ether')
    });
    
    // Create payrool,, check its lit 
    const response = await contract.methods.createNewPayroll().call();
    const payrollId = response.toNumber()
    console.log(`payrollId: ${payrollId}`)
  }

  checkBalance = async() => {
    const { accounts, contract } = this.state;

    // check balance is kosher
    const res = await contract.methods.balanceOf(accounts[0]).call();
    const balance = this.state.web3.utils.fromWei(res._hex)
    console.log(`balance: ${balance}`)
  }

  checkPayroll = async() => {
    const { accounts, contract } = this.state;

    // check balance is kosher
    const payroll_id = await contract.methods.payroll_id().call();
    console.log(`payroll_id: ${payroll_id}`)

    const payroll = await contract.methods.payrolls(2).call();
    console.log(`payroll: ${payroll}`)
  }

  currentPayrollCount =  async() => {
    const { accounts, contract } = this.state;

    const payroll_length = await contract.methods.currentPayrollCount().call();
    console.log(`payroll_length: ${payroll_length}`)
  }

  checkEmployee = async() => {
    const { accounts, contract } = this.state;

    // check balance is kosher
    const employee = await contract.methods.employees(1).call();
    console.log(`employee: ${employee.name}`)
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

  checkLastEmployeePayment = async() => {
    console.log('checkLastEmployeePayment')
    const { accounts, contract } = this.state;

    const payment = await contract.methods.checkLastEmployeePayment().call();
    console.log(`payment: ${payment}`)
  }

  payLastEmployeeOne = async() => {
    console.log('payLastEmployeeOne')
    const { accounts, contract } = this.state;

    const payment = await contract.methods.payLastEmployeeOne().call();
    console.log(`payment: ${payment}`)
  }

  runPayroll = async() => {
    console.log('runPayroll')
    const { accounts, contract } = this.state;

    await contract.methods.runPayroll().call()
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div>
          <button onClick={() => this.checkBalance()}>
            Check Balance
          </button>
        </div>

        <div>
          <button onClick={() => this.createEmployee('0xf104cB0b57EE274838F43399F2EDE8CC8e428560', 2, 'eff')}>
            Create Employee 0xf104cB0b57EE274838F43399F2EDE8CC8e428560
          </button>
        </div>

        <div>
          <button onClick={() => this.checkEmployee()}>
            Check Employees
          </button>
        </div>

        <div>
          <button onClick={() => this.addEmployeeToPayroll(1, 2)}>
            Add Employee 1 to payroll
          </button>
        </div>

        <div>
          <button onClick={() => this.checkLastEmployeePayment()}>
            Check Last Employee Payment
          </button>
        </div>

        <div>
          <button onClick={() => this.getCurrentPayrollId()}>
            Check Payroll Id
          </button>
        </div>

        <div>
          <button onClick={() => this.currentPayrollCount()}>
            Get Current Payroll Length
          </button>
        </div>

        <div>
          <button onClick={() => this.payLastEmployeeOne()}>
            Pay Last Employee 1
          </button>
        </div>

        <div>
          <button onClick={() => this.runPayroll()}>
            Run Payroll
          </button>
        </div>
      </div>
    );
  }
}

export default App;
