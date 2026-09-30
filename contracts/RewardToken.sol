// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    mapping(address => bool) private recyclingCenters;
    mapping(address => bool) private retailers;

    event RecyclingCenterAdded(address indexed center);
    event RecyclingCenterRemoved(address indexed center);
    event RetailerAdded(address indexed retailer);
    event RetailerRemoved(address indexed retailer);
    event RecyclerRewarded(address indexed center, address indexed recycler, uint256 amount);
    event TokensRedeemed(address indexed retailer, address indexed customer, uint256 amount);

    constructor(address initialOwner) ERC20("RecycleReward", "RCT") Ownable(initialOwner) {
        _mint(initialOwner, 1000000 * 10**18); // Initial supply
    }

    function addRecyclingCenter(address _center) public onlyOwner {
        recyclingCenters[_center] = true;
        emit RecyclingCenterAdded(_center);
    }

    function removeRecyclingCenter(address _center) public onlyOwner {
        recyclingCenters[_center] = false;
        emit RecyclingCenterRemoved(_center);
    }

    function addRetailer(address _retailer) public onlyOwner {
        retailers[_retailer] = true;
        emit RetailerAdded(_retailer);
    }

    function removeRetailer(address _retailer) public onlyOwner {
        retailers[_retailer] = false;
        emit RetailerRemoved(_retailer);
    }

    function isRecyclingCenter(address _center) public view returns (bool) {
        return recyclingCenters[_center];
    }

    function isRetailer(address _retailer) public view returns (bool) {
        return retailers[_retailer];
    }

    function rewardRecycler(address recycler, uint256 amount) public {
        require(recyclingCenters[msg.sender], "Not an authorized center");
        uint256 scaledAmount = amount * 10**18;
        _mint(recycler, scaledAmount);
        emit RecyclerRewarded(msg.sender, recycler, scaledAmount);
    }

    // Customer must first call approve(retailer, amount) so the retailer can redeem on their behalf.
    function redeemTokens(address customer, uint256 amount) public {
        require(retailers[msg.sender], "Not an authorized retailer");
        uint256 scaledAmount = amount * 10**18;
        _spendAllowance(customer, msg.sender, scaledAmount);
        _transfer(customer, msg.sender, scaledAmount);
        emit TokensRedeemed(msg.sender, customer, scaledAmount);
    }
}
