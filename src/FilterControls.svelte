<script lang="ts">
    import type { TAGS } from './modrinth';
    import type { Facets } from './lib/modrinth/facets';

    export let value: Facets = []
    export let tags: Awaited<typeof TAGS>
</script>

{JSON.stringify(tags.categories)}

