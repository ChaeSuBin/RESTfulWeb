// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import './SeverStore.sol';

contract CoinDispencer is SeverStore{
    struct userCharge{
        uint price;
        uint8 point;
    }
    string connecTecs = "farewell";
    
    mapping(address => userCharge) purchase;

    modifier fee(uint _fee) {
        if (msg.value != _fee) {
            revert("!REVERT 101");
        } else {
            _;
        }
    }
    function changePoint(uint8 _requirePoint, uint _calcedPirec) external
    payable
    fee(_calcedPirec){
        purchase[msg.sender].point = _requirePoint;
        purchase[msg.sender].price = _calcedPirec;
        //trx(purchase[msg.sender].price);
    }
    function tempView() public view returns(uint){
        return address(this).balance;
    }
    function userPoint() public view returns(uint){
        return purchase[msg.sender].point;
    }
    function connection() public view returns(string memory){
        return connecTecs;
    }
}