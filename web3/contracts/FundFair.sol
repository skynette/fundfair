// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@thirdweb-dev/contracts/extension/ContractMetadata.sol";


/// @title Smart Contract for FundFair v1.0
/// @author Joshua Hassan
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details


contract FundFair is ContractMetadata {
    enum FundingModel {Fixed, Flexible}

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed owner,
        string title,
        uint256 target
    );

    event CampaignFunded(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event CampaignClosed(
        uint256 indexed campaignId,
        address indexed owner,
        bool isSuccessful
    );

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
        bool isFundingGoalReached;
        bool isCampaignClosed;
        FundingModel fundingModel;
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
        string memory _image,
        string memory _fundingModel
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline should be in the future");

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountRaised = 0;
        campaign.image = _image;

        if (keccak256(abi.encodePacked(_fundingModel)) == keccak256(abi.encodePacked("Fixed"))) {
            campaign.fundingModel = FundingModel.Fixed;
        } else if (keccak256(abi.encodePacked(_fundingModel)) == keccak256(abi.encodePacked("Flexible"))) {
            campaign.fundingModel = FundingModel.Flexible;
        } else {
            revert("Invalid funding model");
        }

        emit CampaignCreated(numberOfCampaigns, _owner, _title, _target);

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function fundCampaign(uint256 _id) public payable {
        Campaign storage campaign = campaigns[_id];
        require(!campaign.isCampaignClosed, "Campaign is closed");
        
        uint256 amount = msg.value;
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.amountRaised = campaign.amountRaised + amount;

        emit CampaignFunded(_id, msg.sender, amount);

        if (campaign.amountRaised >= campaign.target) {
            campaign.isFundingGoalReached = true;
        }

        if (campaign.fundingModel == FundingModel.Fixed) {
            require(!campaign.isCampaignClosed, "Campaign is closed");
            campaign.isCampaignClosed = true;
        }

        if (campaign.fundingModel == FundingModel.Flexible) {
            require(!campaign.isCampaignClosed, "Campaign is closed");
        }
    }

    function closeCampaign(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(campaign.owner == msg.sender, "Only campaign owner can close the campaign");
        require(campaign.deadline <= block.timestamp, "Campaign deadline not reached");
        campaign.isCampaignClosed = true;

        if (campaign.amountRaised >= campaign.target) {
            emit CampaignClosed(_id, msg.sender, true);
        } else {
            emit CampaignClosed(_id, msg.sender, false);
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