// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


/// @title Smart Contract for FundFair v1.0
/// @author Joshua Hassan
/// @notice This smart contract is designed for creating and managing crowdfunding campaigns.
/// @dev The contract includes functions for creating, funding, closing campaigns, retrieving campaign and funder details, and withdrawing funds.


contract FundFair {
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

    
    /// @notice Allows a user to fund a specific campaign.
    /// @param _id The ID of the campaign to fund.
    /// @dev The value sent with the transaction (msg.value) is the amount contributed.
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

    /// @notice Closes a specific campaign.
    /// @param _id The ID of the campaign to close.
    /// @dev Can only be called by the campaign owner and after the deadline has passed.
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

    /// @notice Retrieves the addresses and donation amounts of all funders of a specific campaign.
    /// @param _id The ID of the campaign.
    /// @return Two arrays containing the addresses of the funders and the respective amounts they donated.
    function getFunders(uint256 _id) public view returns(address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    /// @notice Returns all campaigns created.
    /// @return An array of all created campaigns.
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++){
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    /// @notice Allows the campaign owner to withdraw funds after the campaign has ended.
    /// @param _campaignId The ID of the campaign from which to withdraw funds.
    function withdraw(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];

        require(msg.sender == campaign.owner, "Only the campaign owner can withdraw funds");
        require(campaign.isCampaignClosed, "Cannot withdraw funds before the campaign is closed");

        // Check if the funding model is Flexible or if the goal was reached for Fixed model
        if(campaign.fundingModel == FundingModel.Flexible || (campaign.fundingModel == FundingModel.Fixed && campaign.isFundingGoalReached)) {
            uint256 amountToWithdraw = campaign.amountRaised;
            require(amountToWithdraw > 0, "No funds to withdraw");
            campaign.amountRaised = 0;

            payable(campaign.owner).transfer(amountToWithdraw);
        } else {
            revert("Funds cannot be withdrawn");
        }
    }

}