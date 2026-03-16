<script lang="ts">
    import { emptyFilters, type Filters } from "./lib/modrinth/filters";
    import { deserializeFilterSet, serializeFilterSet, type FilterSet, type SerializedFilterSet } from "./lib/modrinth/filter-serialization";
    import { localStoreCustom } from "./lib/util/localStore";
    import type { TagTypes } from "./modrinth";

    export let tags: TagTypes
    export let projectType: string
    
    const savedFilters = localStoreCustom<FilterSet, SerializedFilterSet>(
        'saved_filters', 
        {},
        serializeFilterSet,
        deserializeFilterSet(tags),
    )

    function getFilters() {
        return $savedFilters[projectType] ?? emptyFilters()
    }
    
    function setFilters(filters: Filters) {
        $savedFilters[projectType] = filters
    }
</script>

<slot {getFilters} {setFilters} />