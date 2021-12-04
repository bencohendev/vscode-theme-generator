<script>
  import Fuse from "fuse.js"
  import { onMount } from "svelte";
  import colorInfo from "/static/colorInfo.json"
  let value
  let options = {
      includeScore: true,
      useExtendedSearch: true,
      keys: ['tags', 'scopes']
    }
  let colorInfoSearchable =[]
  let searchReturn
  let showResults = false;

  const handleSearch = () => {
    const fuse = new Fuse(colorInfoSearchable, options)
    searchReturn = fuse.search(value)
    if (searchReturn.length > 0) {
      searchReturn = searchReturn.map((result)=>result.item.name)
    } 
    showResults = true
  }
  onMount(()=> {
    Object.values(colorInfo).forEach((colors)=> {
      Object.values(colors).forEach((color)=>{
        colorInfoSearchable.push(color)
      })
    })
  })


</script>

<div>
  <div>Search for a tag or scope to find what color is associated with it</div>
  <input type="text" name="search" id="" bind:value>
  <button on:click={()=>handleSearch()}>Search</button>
</div>
{#if showResults}
  <h4>Try looking at the following colors</h4>
<ul>  
  {#each searchReturn as result}
    <li>{result}</li>
  {/each}
</ul>
{/if}