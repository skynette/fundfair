export interface CampaignResponse {
    success: Campaign[]
}

export interface Campaign {
    owner: string
    title: string
    description: string
    target: number
    targetInUsd: number
    deadline: string
    amountRaised: number
    amountRaisedUSD: number
    image: string
    isFundingGoalReached: boolean
    isCampaignClosed: boolean
    fundingModel: number
    category: number
    donators: string[]
    donations: number[]
    donationsUSD: number[]
    totalDonated: number
    totalDonatedUSD: number
    totalDonators: number
    index: number
}
