<script lang="ts" generics="T">
    export let options: T[]
    export let value: NoInfer<T> | undefined
</script>

{#each options as option}
    <label>
        <input type="radio" bind:group={value} value={option} />
        <slot {option}>
            {option}
        </slot>
    </label>
{/each}