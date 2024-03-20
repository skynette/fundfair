import axiosInstance from "@/lib/axiosInstance";
import SigninRequest from "@/lib/network/auth/SigninRequest";
import SignupRequest from "@/lib/network/auth/SignupRequest";
import SignupResponse from "@/lib/network/auth/AuthResponse";
import { VerifyResponse } from "@/lib/network/auth/VerifyResponse";

export const signup = async (req: SignupRequest): Promise<SignupResponse> => {
    const response = await axiosInstance.post('/register/', { ...req });
    return response.data;
}

export const signin = async (req: SigninRequest): Promise<SignupResponse> => {
    const response = await axiosInstance.post('/login/', { ...req });
    return response.data;
}

export const verifyEmail = async (otp: string, email: string): Promise<VerifyResponse> => {
    const response = await axiosInstance.post(`/verify-email/`, { otp, email });
    return response.data;
}