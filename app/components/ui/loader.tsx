import { Loader } from "lucide-react";

const SpinLoader = ({ message }: { message?: string }) => {
    return (
        <div className="w-full h-full flex flex-col py-4 items-center">
            <Loader className="mr-2 h-8 w-8 animate-spin" />
            <p className="font-medium text-xl">{message ? message : 'Performing Javascript magic'}</p>
        </div>
    );
}

export default SpinLoader;