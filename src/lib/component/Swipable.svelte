<script lang="ts">
    import { onDestroy, type Snippet } from "svelte";
import type { MouseEventHandler } from "svelte/elements";
    import { fade } from "svelte/transition";
    
    const MIN_SWIPE_MOVEMENT = 5
    const MIN_SWIPE_ANIMATION_SPEED = 3
    const SWIPE_MARGIN = 0.25

    const { onSwipe, onSwipeLeft, onSwipeRight, children }: {
        onSwipe?: () => void
        onSwipeLeft?: () => void
        onSwipeRight?: () => void
        children: Snippet
    } = $props()

    let offsetX = $state(0)
    let offsetY = $state(0)
    let movementX = 0
    let dragged = false
    let element: HTMLDivElement

    let animateCallback: number | undefined
    let lastFrameTime = 0
    
    function animate() {
        animateCallback = requestAnimationFrame(time => {
            const deltaTime = lastFrameTime === 0 ? 0 : time - lastFrameTime
            lastFrameTime = time
            
            offsetX += movementX * deltaTime

            animate()
        })        
    }
    
    onDestroy(() => {
        if (animateCallback !== undefined) 
            cancelAnimationFrame(animateCallback)
    })

    function swipeLeft() {
        onSwipe?.()
        onSwipeLeft?.()
        movementX = -MIN_SWIPE_ANIMATION_SPEED
        animate()
    }
    
    function swipeRight() {
        onSwipe?.()
        onSwipeRight?.()
        movementX = MIN_SWIPE_ANIMATION_SPEED
        animate()
    }
    
    const onmousedown: MouseEventHandler<HTMLElement> = event => {
        dragged = true
    }
    
    const onmousemove: MouseEventHandler<Window> = event => {
        if (!dragged) return
        offsetX += movementX = event.movementX
        offsetY += event.movementY
    }
    
    const onmouseup: MouseEventHandler<Window> = _event => {
        if (!dragged) return
        dragged = false
        if (movementX > MIN_SWIPE_MOVEMENT)
            swipeRight()
        else if (movementX < -MIN_SWIPE_MOVEMENT)
            swipeLeft()
        else if (offsetX > element.offsetWidth * SWIPE_MARGIN)
            swipeRight()
        else if (offsetX < -element.offsetWidth * SWIPE_MARGIN)
            swipeLeft()
        else {
            offsetX = 0
            offsetY = 0
            movementX = 0
        }
    }
</script>

<svelte:window {onmousemove} {onmouseup} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div bind:this={element} style:translate="{offsetX}px {offsetY}px" {onmousedown} out:fade|global={{duration: 250}}>
    {@render children()}
</div>

<style>
    div {
        cursor: grab;
        user-drag: none;
        user-select: none;
        -webkit-user-drag: none;
    }
    
    div:active {
        cursor: grabbing;
    }
</style>