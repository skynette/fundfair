import axios from "axios"

interface OPTUSDResponse {
    ethereum: OPT;
}

interface OPT {
    usd: number;
}
export const ethToUSD = async (): Promise<OPTUSDResponse> => {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    return response.data;
}