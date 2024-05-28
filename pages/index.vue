<script setup lang="ts">
const search = ref(null)
const { data, error, pending, refresh } = await useGlossaryApi('api/glossary', {
  query: {
    search,
  },
})

/**
 * Computes and returns organized data based on the provided data.
 * If there is an error, an empty object is returned.
 * The data is organized alphabetically by the first letter of the term.
 * Each letter is associated with an array of entries that start with that letter.
 *
 * @returns {Object} The organized data.
 */
const organizedData = computed(() => {
    if (error.value)
        return {}
    const organized = {}
    for (const entry of data.value) {
        const firstLetter = entry.term.charAt(0).toUpperCase()
        if (!(firstLetter in organized)) {
                organized[firstLetter] = [entry]
        }
        else {
                organized[firstLetter].push(entry)
        }
    }

    return organized
})

// A function that alphabetizes an array of GlossaryEntry
function alphabetizeArray(arr: GlossaryEntry[]) {
    return arr.sort((first: GlossaryEntry, second: GlossaryEntry) => {
        if (first.term < second.term) return -1
        if (first.term > second.term) return 1
        return 0
    })
}

const config = useRuntimeConfig()
// A function that returns the full URL to use in an API call
function fullUrl(suffix: string) {
    return config.public.apiBase + suffix
}

const addPopupVisible = ref(false)
// A function add a new term + definition, given a term and definition
// The backend will handle assigning an id
async function addTerm(term: string, definition: string) {
    await $fetch(fullUrl('api/add'), {
        method: 'POST',
        body: {
            term: term,
            definition: definition
        }
    })
    if (addPopupVisible.value) {
        addPopupVisible.value = false
    }
    refresh()
}

const editingEntry = ref<GlossaryEntry>({id: -1, term: '', definition: ''}) // The entry that is currently being edited
const bulkPopupVisible = ref(false)
</script>

<template>
  <div class="container mx-auto w-1/2 max-lg:w-auto">
    <GlossarySearch v-model:search="search" v-model:addPopupVisible="addPopupVisible" v-model:bulkPopupVisible="bulkPopupVisible"/>
    <GlossaryLetterLinks :data="organizedData" />
    <div class="grid grid-cols-4">
        <GlossaryContent :data="organizedData" :search="search" />
        <GlossarySidebar :data="organizedData" />
    </div>
    <GlossaryDialogAdd v-model:isVisible="addPopupVisible" :addTerm="addTerm" />
    
    <!-- GlossarySideBar -->
    <!-- Where do the dialogs go? -->
  </div>
</template>
