<script>

export let value;
export let label;

const inputChanged = ev => {
    try {
        value = Number(ev.target.value);
    } catch(_) {
        value = null;
    }
}

let numberText = value === null || value === undefined
                 ? "" : value.toString();


</script>

<div class="uk-margin">
    <label class="uk-form-label">{label}</label>
    <div class="uk-form-controls">
        <input class="uk-input"  value={value} on:change={inputChanged} >
    </div>
</div>

