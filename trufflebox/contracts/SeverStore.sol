pragma solidity ^0.8.3;

import '../client/node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';

contract SeverStore is ERC20{

    constructor() ERC20("Thread", "THRe") {
        _mint(msg.sender, 10*10**18);
    }
    struct playTeam {
        address[] name;
        string hash;
    }
    mapping(uint => playTeam) history;

    uint countMint = 0;
    string connecTecs = "farewell";

    function putBlock(uint _team, address[] memory _ptcp, string[] memory _hash) public
    {
        uint8 iterA = 0;
        while(iterA != _ptcp.length)
        {
            //history[_team].name[iterA] = _ptcp[iterA];
            history[_team].name.push(_ptcp[iterA]);
            history[_team].hash = _hash[0];
            _mint(_ptcp[iterA], 1*10**18);
            ++iterA;
            ++countMint;
        }
    }
    function getname(uint _teamId) public view returns(address[] memory){
        return history[_teamId].name;
    }
    function gethash(uint _teamId) public view returns(string memory){
        return history[_teamId].hash;
    }
    function connection() public view returns(string memory){
        return connecTecs;
    }
}

//["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"]
//["hasha", "hashb"]