<script>
  import Fuse from "fuse.js"
  import { onMount } from "svelte";
  import colorInfo from "/static/colorInfo.json"
  let value
  let options = {
      includeScore: true,
      useExtendedSearch: true,
      includeMatches: true,
      threshold: .4,
      keys: ['tags', 'scopes']
    }
  let colorInfoSearchable =[]
  let searchReturn
  let showResults = false;

  const handleSearch = () => {
    const fuse = new Fuse(colorInfoSearchable, options)
    searchReturn = fuse.search(value)
    if (searchReturn.length > 0) {
      searchReturn = searchReturn.map((result)=>{
        const formattedResult = {
          name: result.item.name,
          matches: result.matches,
          showMatches: false
        }
        return formattedResult
      })
    } 
    showResults = true
  }
  const showMatches = (e,i) => {
    searchReturn[i].showMatches = !searchReturn[i].showMatches
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
  <div class="search-text">Search for a tag or scope to find what color is associated with it</div>
  <input type="text" name="search" id="" bind:value>
  <button on:click={()=>handleSearch()}>Search</button>
</div>
{#if showResults}
  <h4>Try looking at the following colors</h4>
  <ul>  
    {#each searchReturn as result, i}
      <li on:click={(e)=>showMatches(e,i)}>{result.name}</li>
      {#if result.showMatches == true}
        <ul>
          {#each result.matches as match}
            <li>{match.key}: {match.value}</li>
          {/each}
        </ul>
      {/if}
    {/each}
  </ul>
{/if}

<style>
  .search-text {
    margin-bottom: 1rem;
  }
</style>