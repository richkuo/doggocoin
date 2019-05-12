const PayrollContract = artifacts.require("./PayrollContract.sol");

contract("PayrollContract", accounts => {
  it("...deposit.", async () => {
    const PayrollContractInstance = await PayrollContract.deployed(); 
    await PayrollContractInstance.deposit({ from: accounts[0], value: web3.utils.toWei("1", 'ether') })

    const res = await PayrollContractInstance.balanceOf(accounts[0], { from: accounts[0] })
    const balance = web3.utils.fromWei(res, 'ether');

    assert.equal(balance, "1", "deposited value not equal to balance");
  });

  it("...createNewPayroll.", async () => {
    const PayrollContractInstance = await PayrollContract.deployed();
    await PayrollContractInstance.deposit({ from: accounts[0], value: web3.utils.toWei("1", 'ether') })

    await PayrollContractInstance.createNewPayroll({ from: accounts[0] })
    const res = await PayrollContractInstance.payroll_id()
    const payrollId = res.toString()
    assert.equal(payrollId, "1", "payroll id is not 1")

    // const res1 = await PayrollContractInstance.payrolls(1, {from: accounts[0]})
    // console.log(res1)
    // assert.equal(balance, "1", "deposited value not equal to balance");

    const res2 = await PayrollContractInstance.currentPayrollCount.call()
    const payrollCount = res2.toString()
    assert.equal(payrollCount, "0", "reseted payroll count");
  });

  it("...createEmployee.", async () => {
    const PayrollContractInstance = await PayrollContract.deployed(); 
    await PayrollContractInstance.deposit({ from: accounts[0], value: web3.utils.toWei("1", 'ether') })

    // call is not good for send functions 
    // const res = await PayrollContractInstance.createEmployee.call(accounts[1], 2, { from: accounts[0] })
    // const employeeId = res.toString()
    // assert.equal(employeeId, "1", "employee id is not 1");

    const res = await PayrollContractInstance.createEmployee(accounts[1], 2, { from: accounts[0] })
    const res1 = await PayrollContractInstance.employees(1)
    const employeeId = res1.employee_id.toString()
    assert.equal(employeeId, "1", "employee id is not 1");
  });

  it("...addEmployeeToPayroll.", async () => {
    const PayrollContractInstance = await PayrollContract.deployed(); 
    await PayrollContractInstance.deposit({ from: accounts[0], value: web3.utils.toWei("1", 'ether') })

    await PayrollContractInstance.createEmployee(accounts[1], 2, { from: accounts[0] })
    await PayrollContractInstance.addEmployeeToPayroll(1, 20, { from: accounts[0] })

    const res2 = await PayrollContractInstance.currentPayrollCount.call()
    const payrollCount = res2.toString()
    assert.equal(payrollCount, "1", "payroll count update");
    
  });

});
