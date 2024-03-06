import { ChartLineUp, FlowerTulip, ShieldCheck } from "@phosphor-icons/react";
import { nanoid } from 'nanoid';

interface AboutItemInterface {
    icon: React.ReactNode; title: string; desc: string
}

const about: AboutItemInterface[] = [
    {
        icon: <FlowerTulip size={24} />,
        title: 'Immediate Impact',
        desc: 'Your donations directly provide necessities such as food, education.'
    },
    {
        icon: <ChartLineUp size={24} />,
        title: 'Transparency',
        desc: 'Every contribution is tracked, showing how your help is invaluable.'
    },
    {
        icon: <ShieldCheck size={24} />,
        title: 'Safe and Secure',
        desc: 'PCI and data privacy compliance with encyption and protection against frauds'
    },
]

const AboutItem = ({ icon, title, desc }: AboutItemInterface) => {
    return (
        <div className="rounded-xl p-4 bg-white/30">
            <div className="flex items-center space-x-1 text-white">
                {icon}
                <p className="text-xl font-bold">{title}</p>
            </div>
            <p className="text-sm mt-2 font-normal text-white">{desc}</p>
        </div>
    )
}

const About = () => {
    return (
        <div className="bg-purple-600 py-12">
            <div className="container flex flex-col items-center">
                <p className="text-3xl text-center text-white font-semibold">Why you should choose <span className="border-b-6 border-b-yellow-500">FundFair?</span></p>
                <p className="text-white font-medium text-center mt-2 max-w-[55%]">
                    Our platform ensures that every donation, big or small, directly advances our mission to tackle pressing global issues. With a focus on transparency
                </p>

                <div className="mt-8 grid grid-cols-3 gap-x-4">
                    {
                        about.map(item => <AboutItem key={nanoid()} {...item} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default About;