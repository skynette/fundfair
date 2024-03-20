import axiosInstance from "@/lib/axiosInstance";
import { CampaignRequest } from "@/lib/network/campaign/CampaignRequest";
import { convertUsdToOp } from "@/lib/utils";

export const createCampaign = async (req: CampaignRequest): Promise<any> => {
    const deadlineInSeconds = Math.floor(new Date(req.deadline).getTime() / 1000);
    const token = JSON.parse(localStorage.getItem('fundfair') ?? '{}').token.access;
    const targetInOp = await convertUsdToOp(Number(req.target));

    const formData = new FormData();
    formData.append('owner', req.owner);
    formData.append('title', req.title);
    formData.append('description', req.description);
    formData.append('target', targetInOp.toString());
    formData.append('deadline', deadlineInSeconds.toString());
    formData.append('image', req.image[0]);
    formData.append('fundingModel', req.type);
    formData.append('category', req.category);

    const response = await axiosInstance.post('/campaign/create/', formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    });

    return response.data;
}