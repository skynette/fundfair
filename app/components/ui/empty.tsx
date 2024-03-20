import { Package } from "@phosphor-icons/react";

const Empty = () => {
    return (
        <div className="h-full flex flex-col py-4 items-center">
            <Package size={72} weight="duotone" />
            <p className="font-normal">No campaign found :(</p>
        </div>
    )
}

export default Empty;