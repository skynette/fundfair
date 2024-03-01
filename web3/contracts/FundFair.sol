// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@thirdweb-dev/contracts/extension/ContractMetadata.sol";


/// @title Smart Contract for FundFair v1.0
/// @author Joshua Hassan
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details


contract FundFair is ContractMetadata {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountRaised;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;
    address public deployer;
 
    constructor() {
        deployer = msg.sender;
    }

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {

        // create a campaign at current index first then edit the values in it
        Campaign storage campaign = campaigns[numberOfCampaigns];
        require(campaign.deadline < block.timestamp, "deadline should be a future date");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountRaised = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function fundCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,) = payable(campaign.owner).call{value: amount}("");
        require(sent, "error funding campaign");

        if (sent) {
            campaign.amountRaised = campaign.amountRaised + amount;
        }

    }

    function getFunders(uint256 _id) public view returns(address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++){
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    function _canSetContractURI() internal view virtual override returns (bool){
        return msg.sender == deployer;
    }
}