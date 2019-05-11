const PayrollContract = artifacts.require("./PayrollContract.sol");

contract("PayrollContract", accounts => {
  it("...deposit.", async () => {
    const PayrollContractInstance = await PayrollContract.deployed();

    await PayrollContractInstance.deposit({ from: accounts[0], value: web3.utils.toWei("1", 'ether') })

    const res = await PayrollContractInstance.balanceOf(accounts[0], { from: accounts[0] })
    const balance = web3.utils.fromWei(res, 'ether');

    assert.equal(balance, "1", "deposited value not equal to balance");
  });
});
