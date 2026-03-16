<script lang="ts">
    import { deserializeFilterSet, emptyFilters, serializeFilterSet, type Filters, type SerializedFilters } from "./lib/modrinth/filters";
    import { localStoreCustom } from "./lib/util/localStore";
    import type { TagTypes } from "./modrinth";

    export let tags: TagTypes
    export let projectType: string
    
    const savedFilters = localStoreCustom<Record<string, Filters>, Record<string, SerializedFilters>>(
        'saved_filters', 
        {},
        serializeFilterSet,
        deserializeFilterSet(tags),
    )
    
    $: if (!(projectType in $savedFilters))
        $savedFilters[projectType] = emptyFilters()
</script>

<slot filters={$savedFilters[projectType]} />