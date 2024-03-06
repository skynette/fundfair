'use client'

import About from "./components/layout/about";
import FeaturedCampaign from "./components/layout/featured-campaign";
import Hero from "./components/layout/hero";

export default function Home() {
    return (
        <div>
            <Hero />
            <FeaturedCampaign />
            <About />
        </div>
    );
}