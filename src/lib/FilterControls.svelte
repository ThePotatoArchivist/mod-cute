<script lang="ts">
    import type { Facets, TAGS } from './modrinth';

    export let value: Facets = []
    export let tags: Awaited<typeof TAGS>
</script>

{tags.categories.filter(e => e.project_type === 'mod').map(e => e.name)}

