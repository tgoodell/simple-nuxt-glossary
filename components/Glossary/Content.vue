<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default() {
      return {}
    },
  },
  search: {
    type: String,
    default: ''
  }
})

// A function that highlights text that matches the search query
function highlightSearchTerm(words: string) {
    // Currently results in infinite recursion
    // if (props.search !== null) {
    //     // Transform props.search Query to possible matches
    //     const lowerSquery = props.search.toLowerCase()
    //     const upperSquery = props.search.toUpperCase()
    //     const capitalSquery = lowerSquery.charAt(0).toUpperCase() + lowerSquery.slice(1)

    //     const winnerSquery = ref<string[]>([])

    //     // // We check all three cases because, theoretically, a definition could include all three
    //     // // Case 1: All lowercase
    //     if (words.includes(lowerSquery)) winnerSquery.value.push(lowerSquery)
    //     // // // Case 2: Key term is uppercase
    //     if (words.includes(upperSquery)) winnerSquery.value.push(upperSquery)
    //     // // // Case 3: Key term is capitalized
    //     if (words.includes(capitalSquery)) winnerSquery.value.push(capitalSquery)

    //     const highlightedText = ref(words)
    //     for (let i=0; i<winnerSquery.value.length; i++) {
    //         highlightedText.value = highlightedText.value.replaceAll(winnerSquery.value[i], `<span class='bg-yellow-100'>${winnerSquery.value[i]}</span>`)
    //     }   
    //     return highlightedText.value
    // }
    return words
}
</script>

<template>
  <!-- Content Body -->
    <!-- List of Terms and Definitions, Organized by Letter -->
    <div class="col-span-3">
      <div v-for="(section, key) in data">
        <!-- Only show letter section if there are Glossary Entries that begin with that letter -->
        <h2 :id="key" class="text-5xl font-semibold font-serif">
          {{ key }}
        </h2>
        <DataView :value="section">
          <template #list="slotProps">
            <div class="grid grid-nogutter">
              <div v-for="entry in slotProps.items" :id="slugify(entry.term)" :key="entry.id" class="leading-7 my-2 font-sans">
                <!-- Normal Output -->
                  <h2 class="text-2xl font-medium my-2">
                    <span v-html="highlightSearchTerm(entry.term)" />
                    <Button icon="pi pi-pencil" class="border-0 text-slate-300" size="small" />
                  </h2>
                  <p v-html="highlightSearchTerm(entry.definition)" />

                <!-- Edit Mode -->
                <!-- <div v-else>
                  <div class="my-2">
                    <InputText id="term" v-model="editingEntry.term" class="text-2xl font-medium leading-8" size="small" />
                    <label for="term" hidden>Term</label>
                    <Button icon="pi pi-times" class="border-0 text-rose-400 hover:text-rose-700 h-12" @click="turnOffEditMode()" />
                    <Button icon="pi pi-check" class="border-0 text-green-600 hover:text-green-900 h-12" :disabled="invalidInput(editingEntry.term) || invalidInput(editingEntry.definition)" @click="saveEdits()" />
                  </div>
                  <Textarea id="definition" v-model="editingEntry.definition" class="w-full" size="small" />
                  <label for="definition" hidden>definition</label>
                </div> -->
              </div>
            </div>
          </template>
        </DataView>
        <hr class="my-4">
      </div>
  </div>
</template>
