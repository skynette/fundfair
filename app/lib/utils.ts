import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Campaign } from "./types";
import { ethers } from "ethers";
import axios from 'axios'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const queryClientOptions = {
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 3600000 // 1 hr before data goes stale
        },
    },
};

export const userLoggedIn = (user: any) => {
    return Object.keys(user ?? {}).length > 0;
}


/**
 * Converts raw campaign data from blockchain response into a typed array of Campaign objects.
 *
 * This function takes raw campaign data typically fetched from a blockchain or smart contract,
 * which comes in the form of arrays of values, and converts each array into a structured Campaign object.
 * It handles conversion and casting of BigNumber hexadecimal strings to appropriate JavaScript data types,
 * such as strings or numbers, depending on the context and needs of the application to ensure type safety and data integrity.
 *
 * @param {any[]} rawData - An array of raw campaign data entries, where each entry is an array representing a single campaign.
 * Each campaign array is expected to follow a specific structure, containing the campaign's details such as owner address,
 * title, description, funding targets, deadlines, amounts raised, and other relevant campaign information.
 *
 * @returns {Campaign[]} An array of Campaign objects, each representing a campaign with structured and typed information.
 * The returned Campaign objects match the Campaign interface, providing a consistent data structure for use within the application.
 *
 * Note: This function assumes that the raw data follows a predefined format and structure.
 * If the structure of the raw data changes (e.g., due to changes in the smart contract),
 * this function will need to be updated accordingly to ensure correct mapping and data integrity.
 *
 * Usage example:
 * const typedCampaigns = convertToCampaigns(rawBlockchainData);
 */
export function convertToCampaigns(rawData: any[]): Campaign[] {
    return rawData.map(item => {
        const campaign: Campaign = {
            owner: item[0] as string,
            title: item[1] as string,
            description: item[2] as string,
            target: hexToOp(item[3]._hex),
            deadline: Number(ethers.BigNumber.from(item[4]._hex)),
            amountRaised: hexToOp(item[5]._hex),
            image: item[6],
            donators: item[7],
            donations: item[8],
            isFundingGoalReached: item[9],
            isCampaignClosed: item[10],
            fundingModel: item[11],
            category: item[12],
        };

        return campaign;
    });
}

export function hexToOp(hex: string): string {
    return ethers.utils.formatEther(ethers.BigNumber.from(hex));
}

export async function formatUsdToOp(usdAmount: string) {
    let op = await convertUsdToOp(parseInt(usdAmount));
    return ethers.utils.parseUnits(op.toString(), 18).toString()
}

export async function convertUsdToOp(usdAmount: number) {
    try {
        // Fetch the current exchange rate from CoinGecko
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=usd');
        const rate = response.data.optimism.usd; // The current price of 1 OP in USD

        // Convert the USD amount to OP
        const opAmount = usdAmount / rate;

        return opAmount;
    } catch (error) {
        console.error('Error converting USD to OP:', error);
        throw error;
    }
}

// Example usage:
convertUsdToOp(50).then(opAmount => {
    console.log(`$50 is approximately ${opAmount} OP`);
}).catch(error => {
    console.error('Conversion error:', error);
});


export async function convertOpToUsd(opAmount: number) {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=usd');
        const rate = response.data.optimism.usd;

        // Convert the OP amount to USD
        const usdAmount = opAmount * rate;

        return usdAmount;
    } catch (error) {
        console.error('Error converting OP to USD:', error);
        throw error;
    }
}

// Example usage:
convertOpToUsd(10).then(usdAmount => {
    console.log(`3012 OP is approximately $${usdAmount}`);
}).catch(error => {
    console.error('Conversion error:', error);
});



export async function uploadImage(file: any) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post('/endpoint', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data.imageUrl; 
}
