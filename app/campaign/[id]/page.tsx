import LeftPane from "@/components/campaign/LeftPane";
import RightPane from "@/components/campaign/RightPane";

const CampaignDetail = () => {
    return (
        <div className="container">
            <div className="py-2 grid gap-y-8 grid-cols-1 lg:py-8 lg:gap-x-7 lg:gap-y-0 lg:grid-cols-[3fr_1.5fr]">
                <LeftPane />
                <RightPane />
            </div>
        </div>
    )
}

export default CampaignDetail;