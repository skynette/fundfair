export interface Campaign {
    owner: string;
    title: string;
    description: string;
    target: string;
    deadline: Number;
    amountRaised: string;
    image: string;
    donators: string[];
    donations: string[];
    isFundingGoalReached: boolean;
    isCampaignClosed: boolean;
    fundingModel: FundingModel;
    category: CauseCategory;
}

export enum FundingModel {
    Fixed,
    Flexible
}

export enum CauseCategory {
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


export interface BlockchainTransactionResponse {
    to: string;
    from: string;
    transactionHash: string;
    events: BlockchainEvent[];
}

export interface BlockchainEvent {
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

export interface CampaignCreatedArgs {
    campaignId: BigNumber;
    owner: string;
    title: string;
    target: BigNumber;
}


export interface BigNumber {
    type: string;
    hex: string;
}
