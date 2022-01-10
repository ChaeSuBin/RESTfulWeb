//var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var SeverStore = artifacts.require("./SeverStore.sol");

module.exports = function(deployer) {
  deployer.deploy(SeverStore);
};
