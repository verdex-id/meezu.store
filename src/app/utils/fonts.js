import {Silkscreen} from "next/font/google"

export const silkscreen_init = Silkscreen({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-silkscreen",
    weight: ["400", "700"]
})

export const silkscreen = silkscreen_init.className;