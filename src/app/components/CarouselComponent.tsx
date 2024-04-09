
"use client";

import { Card, Carousel } from "flowbite-react";
import CardComponent from "./CardComponent";

export function CarouselComponent() {
    return (
        <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 grid col-span-5">
            <Carousel slide={false} indicators={false}>
                <div className="flex justify-around gap-0">
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                </div>
            </Carousel>
        </div>
    );
}
