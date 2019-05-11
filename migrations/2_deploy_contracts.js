var PayrollContract = artifacts.require("./PayrollContract.sol");

module.exports = function(deployer) {
  deployer.deploy(PayrollContract);
};
