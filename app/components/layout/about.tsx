import { ChartLineUp, FlowerTulip, ShieldCheck } from "@phosphor-icons/react";
import { nanoid } from 'nanoid';
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";

interface AboutItemInterface {
    icon?: React.ReactNode; title: string; desc: string
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

const about2: AboutItemInterface[] = [
    {
        title: 'Health Initiatives',
        desc: 'Provide essential medical care and health education to regions where its needed.'
    },
    {
        title: 'Environmenal Action',
        desc: 'Protect our planet by supporting conservation effort and sustainable solutions'
    },
    {
        title: 'Human Rights',
        desc: 'Advocate and support human rights protection globally'
    },
    {
        title: 'Educational Support',
        desc: 'Invest in the future by funding educational programs and resources'
    },
]

const AboutItem = ({ icon, title, desc }: AboutItemInterface) => {
    return (
        <div className="rounded-xl p-4 bg-white/30">
            <div className="flex items-center space-x-1 text-white">
                {icon}
                <p className="text-lg font-semibold lg:text-xl lg:font-bold">{title}</p>
            </div>
            <p className="text-sm mt-2 font-normal text-white">{desc}</p>
        </div>
    )
}

const AboutItem2 = ({ title, desc }: AboutItemInterface) => {
    return (
        <div className="flex flex-col border-2 border-purple-500/30 rounded-xl p-4 bg-white">
            <p className="text-lg font-semibold lg:text-xl lg:font-bold">{title}</p>
            <p className="text-sm mt-2 font-normal">{desc}</p>
        </div>
    )
}

const About = () => {
    return (
        <div className="flex flex-col space-y-12">
            <div className="container grid grid-cols-1 lg:gap-x-20 lg:grid-cols-[2fr_1.5fr]">
                <div className="flex flex-col w-full">
                    <h1 className="capitalize text-xl leading-relaxed font-bold lg:text-3xl">impactful <span className="border-b-4 border-b-yellow-500">giving platform</span> from fundraising hub</h1>
                    <p className="text-gray-600 text-sm mt-4 mb-6">
                        Connect your philanthropy with causes that matter. Our platform
                        channels your donations to charities, ensuring that every dollar
                        contributes to change. Our dedicated system is designed for
                        transparency
                    </p>

                    <div className="grid gap-y-2 grid-cols-1 lg:grid-cols-2 lg:gap-3">
                        {
                            about2.map(item => <AboutItem2 key={nanoid()} {...item} />)
                        }
                    </div>
                </div>

                <Image src='/about.png'
                    alt=""
                    width={368}
                    height={307}
                    className="rounded-md object-cover" />
            </div>

            <div className="bg-purple-600 py-12">
                <div className="container flex flex-col items-center">
                    <p className="text-3xl text-center text-white font-bold">Why you should choose <span className="border-b-4 border-b-yellow-500">FundFair?</span></p>
                    <p className="text-white font-medium text-center mt-2 lg:max-w-[55%]">
                        Our platform ensures that every donation, big or small, directly advances our mission to tackle pressing global issues. With a focus on transparency
                    </p>

                    <div className="mt-8 grid gap-y-3 grid-cols-1 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0">
                        {
                            about.map(item => <AboutItem key={nanoid()} {...item} />)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;