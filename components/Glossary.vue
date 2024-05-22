<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api';
import { onMounted } from 'vue';
// Glossary with Definitions and Terms
    // Features:
        // Add term + definition
        // Edit term + definition
        // Bulk import
        // Search
    // Strategy:
        // Create API endpoint with Mocks Server
        // $fetch it
        // Probably best to just use a Data Table to render terms + definitions

const config = useRuntimeConfig()
const glossary = ref()
const editingRows = ref([]);
const popupVisible = ref(false)
const newTerm = ref('')
const newDefinition = ref('')
const baseSortedTerms = ref<Record<string, GlossaryEntry[]>>({})
const prevSectionExists = ref(false)

interface GlossaryEntry {
    id: number
    term: String
    definition: String
}

// A function that returns the full URL to use in an API call
function fullUrl(suffix: string) {
    return config.public.apiBase + suffix
}

// A function that will populate baseSortedTerms with keys A-Z
function generateSortedTermsScaffold(): void {
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        baseSortedTerms.value[letter] = [];
    }
}

// A function that turns a word into kebab case
function slugify(word: String) {
    return word.toLowerCase().replace(/\s+/g, '-').replace('/','-')
}

// A function to fetch the pre-existing glossary
// Will also alphabetize and group together the terms
async function getGlossary() {
    const data: GlossaryEntry[] = await $fetch(fullUrl('api/glossary'), {
        method: 'GET',
    })
    // Step 1: Sort all terms
    const orderedData = ref()
    // Transform data so it is in alphabetical order by term
    orderedData.value = data.sort((first: GlossaryEntry, second: GlossaryEntry) => {
        if (first.term < second.term) return -1
        if (first.term > second.term) return 1
        return 0
    })

    // Step 2: Group all terms together by starting letter
    const sortedTerms = ref(JSON.parse(JSON.stringify(baseSortedTerms.value)))
    for (const entry of orderedData.value) {
        sortedTerms.value[entry.term.charAt(0)].push(entry)
    }

    glossary.value = sortedTerms.value
}

// A function to add a new term given its id, term, and definition
// If the given id belongs to a current entry, that entry will be edited
// Otherwise, it will return a 404 status
async function editTerm(id: number, term: string, definition: string) {
    await $fetch(fullUrl('api/glossary'), {
        method: 'POST',
        body: {
            id: id,
            term: term,
            definition: definition
        }
    })
}

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
    if (popupVisible.value) {
        popupVisible.value = false
    }
    getGlossary()
}

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const onRowEditSave = async (event) => {
    let { newData, index } = event;

    console.log({newData, index})
    // Things to do
        // Send update request to mocks
        // Refetch Glossary to update the table

    editTerm(index, newData.term, newData.definition)
    getGlossary()
};

onMounted(() => {
    getGlossary()
    generateSortedTermsScaffold()
})
</script>

<template>
    <div class="container mx-auto w-1/2 max-lg:w-auto">
        <!-- Search + Add Term Bar -->
        <Toolbar class="mt-3 rounded-none fixed top-0 w-1/2">
            <template #center>
                <IconField iconPosition="left">
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText placeholder="Search" />
                </IconField>
            </template>
            <template #end>
                <Button icon="pi pi-file-arrow-up" class="text-slate-100 bg-sky-600 hover:bg-sky-900 mr-1" @click="" />
                <Button icon="pi pi-plus" class="text-slate-100 bg-sky-600 hover:bg-sky-900" @click="popupVisible=true" />
            </template>
        </Toolbar>

        <!-- Links to Letter Section Toolbar -->
        <Toolbar class="border-0 mb-4 mt-20">
            <template #center>
                <span v-for="(entries, letter) in glossary">
                    <a :href="'#' + letter" v-if="entries.length > 0" class="mx-1 text-sky-600 hover:text-sky-900 underline">{{ letter }}</a>
                    <span v-else>...</span>
                </span>
            </template>
        </Toolbar>

        <!-- Content Body -->
        <div class="grid grid-cols-4">
            <!-- List of Terms and Definitions, Organized by Letter -->
            <div class="col-span-3">
                <div v-for="(entries, letter) in glossary" >
                    <!-- Only show letter section if there are Glossary Entries that begin with that letter -->
                    <div v-if="entries.length > 0">
                        <h2 class="text-5xl font-semibold font-serif" :id="letter">{{ letter }}</h2>
                        <DataView :value="entries">
                            <template #list="slotProps">
                                <div class="grid grid-nogutter">
                                    <div v-for="(item, index) in slotProps.items" :key="index" class="leading-7 my-2 font-sans" :id="slugify(item.term)">
                                        <h2 class="text-2xl font-medium my-2">
                                            {{ item.term }}
                                            <Button icon="pi pi-pencil" class="border-0 text-slate-300" size="small"/>
                                        </h2>
                                        <p>{{ item.definition }}</p>
                                    </div>
                                </div>
                            </template>
                        </DataView>
                        <hr class="my-4"/>
                    </div>
                </div>
            </div>

            <!-- Sidebar with List of Term Links -->
            <div class="col-span-1 ml-4">
                <h2 class="text-xl border-b-2 sticky top-20 font-sans font-medium">Terms</h2>
                <ScrollPanel class="sticky top-25 h-80-vh">
                    <div v-for="(entries, letter) in glossary" class="my-2">
                        <div v-if="entries.length > 0">
                            <h3 class="font-serif">{{ letter }}</h3>
                            <ul class="leading-6">
                                <li v-for="entry in entries">
                                    <a :href="'#' + slugify(entry.term)" class="text-sky-600 hover:text-sky-900 underline font-sans">
                                        {{ entry.term }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </ScrollPanel>
            </div>
        </div>

        <!-- Add Term Popup -->
        <!-- Since Primevue Dialog does not allow us pass a class, we must use an inline style -->
        <Dialog v-model:visible="popupVisible" modal header="Add Entry" :style="{ width: '25rem' }">
            <span class="text-surface-600 dark:text-surface-0/70 block mb-5">Submit a new term and definition pair.</span>
            <label for="term" class="block text-sm font-medium leading-6 text-gray-900">Term</label>
            <InputText v-model="newTerm" id="term" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2" />
            <label for="term" class="block text-sm font-medium leading-6 text-gray-900">Definition</label>
            <Textarea v-model="newDefinition" id="definition" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2" />
            <div class="flex justify-end gap-2 mt-4">
                <Button type="button" label="Cancel" class="bg-stone-100 hover:bg-stone-200" @click="popupVisible=false"></Button>
                <Button type="button" label="Save" class="bg-sky-100 hover:bg-sky-200" @click="addTerm(newTerm, newDefinition)"></Button>
            </div>
        </Dialog>
    </div>
</template>