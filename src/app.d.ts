import type { SearchResultHit as SearchResultHitOriginal } from "@xmcl/modrinth";

declare module "@xmcl/modrinth" {
    export interface SearchResultHit extends SearchResultHitOriginal {
        color: number
        display_categories: string[]
    }
}

import '@poppanator/sveltekit-svg/dist/svg.d.ts'