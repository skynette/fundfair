interface Campaign {
    owner: string;
    title: string;
    description: string;
    target: BigNumber;
    deadline: BigNumber;
    amountRaised: BigNumber;
    image: string;
    donators: string[];
    donations: BigNumber[];
    isFundingGoalReached: boolean;
    isCampaignClosed: boolean;
    fundingModel: FundingModel;
    category: CauseCategory;
}

enum FundingModel {
    Fixed,
    Flexible
}

enum CauseCategory {
    HealthAndMedicine,
    EnvironmentAndWildlife,
    EducationAndResearch,
    PovertyAndHumanServices,
    ArtsCultureAndHumanities,
    ChildrenAndYouth,
    DisasterReliefAndEmergencyResponse,
    AnimalWelfare,
    CommunityAndCivicProjects,
    TechnologyAndInnovation,
    VeteransAndMilitaryFamilies,
    HumanRightsAndSocialJustice,
    InternationalAidAndDevelopment,
    FaithBasedAndReligious,
    SportsAndRecreation,
    MentalHealthAndWellness
}


interface BlockchainTransactionResponse {
    to: string;
    from: string;
    transactionHash: string;
    events: BlockchainEvent[];
}

interface BlockchainEvent {
    transactionIndex: number;
    blockNumber: number;
    transactionHash: string;
    address: string;
    topics: string[];
    data: string;
    logIndex: number;
    blockHash: string;
    args: CampaignCreatedArgs[] | any[];
    event: string;
    eventSignature: string;
}

interface CampaignCreatedArgs {
    campaignId: BigNumber;
    owner: string;
    title: string;
    target: BigNumber;
}


interface BigNumber {
    type: string;
    hex: string;
}
