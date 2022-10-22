<script>
    export let title;
    export let description;
</script>

<div>
    <h1>{title}</h1>
    <p>{description}</p>
    <div>
        <slot></slot>
    </div>
</div>
