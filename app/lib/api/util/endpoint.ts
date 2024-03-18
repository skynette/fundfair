import axios from "axios"

interface OPTUSDResponse {
    optimism: OPT;
}

interface OPT {
    usd: number;
}
export const optToUSD = async (): Promise<OPTUSDResponse> => {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=usd');
    return response.data;
}