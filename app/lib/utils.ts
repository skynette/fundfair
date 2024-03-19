import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Campaign } from "./types";

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
function convertToCampaigns(rawData: any[]): Campaign[] {
    return rawData.map(item => ({
        // Conversion logic goes here, e.g.,
        // owner: item[0] as string,
        // title: item[1] as string,
        // description: item[2] as string,
        // target: convertToNumber(item[3].hex), // or convertToString based on context
        // deadline: convertToNumber(item[4].hex), // or convertToString
        // amountRaised: convertToNumber(item[5].hex), // or convertToString
        // Other fields...
    }));
}
