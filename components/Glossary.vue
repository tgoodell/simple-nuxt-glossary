<script setup lang="ts">
import { onMounted } from 'vue';
// Glossary with Definitions and Terms
    // Features:
        // Add term + definition
        // Edit term + definition
        // Bulk import
        // Search

interface GlossaryEntry {
    id: number
    term: string
    definition: string,
}

const config = useRuntimeConfig()
const glossary = ref<Record<string, GlossaryEntry[]>>({}) // The local glossary rendered on the page
const newPopupVisible = ref(false) // Whether the Add Entry popup is visible
const bulkPopupVisible = ref(false) // Whether the Bulk Import popup is visible
const baseSortedTerms = ref<Record<string, GlossaryEntry[]>>({}) // The scaffolding format for glossary
const searchQuery = ref('') // The Search Query modified by the search bar
const orderedData = ref() // Raw ordered data
const editingEntry = ref<GlossaryEntry>({id: -1, term: '', definition: ''}) // The entry that is currently being edited

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
function slugify(word: string) {
    return word.toLowerCase().replaceAll(/\s+/g, '-').replaceAll('/','-')
}

// A function that alphabetizes an array of GlossaryEntry
function alphabetizeArray(arr: GlossaryEntry[]) {
    return arr.sort((first: GlossaryEntry, second: GlossaryEntry) => {
        if (first.term < second.term) return -1
        if (first.term > second.term) return 1
        return 0
    })
}

// A function that organizes an array by starting letter into an Object
function groupByLetter(arr: GlossaryEntry[]) {
    const sortedTerms = ref(JSON.parse(JSON.stringify(baseSortedTerms.value)))
    for (const entry of arr) {
        sortedTerms.value[entry.term.charAt(0)].push(entry)
    }
    return sortedTerms.value
}

// A function that highlights text that matches the search query
function highlightSearchTerm(words: string) {
    if (searchQuery.value !== '') {
        // Transform Search Query to possible matches
        const lowerSquery = searchQuery.value.toLowerCase()
        const upperSquery = searchQuery.value.toUpperCase()
        const capitalSquery = lowerSquery.charAt(0).toUpperCase() + lowerSquery.slice(1)

        const winnerSquery = ref<string[]>([])

        // We check all three cases because, theoretically, a definition could include all three
        // Case 1: All lowercase
        if (words.includes(lowerSquery)) winnerSquery.value.push(lowerSquery)
        // Case 2: Key term is uppercase
        if (words.includes(upperSquery)) winnerSquery.value.push(upperSquery)
        // Case 3: Key term is capitalized
        if (words.includes(capitalSquery)) winnerSquery.value.push(capitalSquery)

        const highlightedText = ref(words)
        for (let i=0; i<winnerSquery.value.length; i++) {
            highlightedText.value = highlightedText.value.replaceAll(winnerSquery.value[i], `<span class='bg-yellow-100'>${winnerSquery.value[i]}</span>`)
        }
        return highlightedText.value
    }
    return words
}

// A function that advises whether we are in edit more or not
function inEditMode() {
    return editingEntry.value.id !== -1
}

// A function to turn on edit mode for a term + definition
function turnOnEditMode(entry: GlossaryEntry) {
    editingEntry.value = JSON.parse(JSON.stringify(entry))
}

// A function to turn off edit mode for a term + definition
function turnOffEditMode() {
    editingEntry.value = {id: -1, term: '', definition: ''}
}

// A function that is called when the client wants to send edits to the server
function saveEdits() {
    editTerm(editingEntry.value.id, editingEntry.value.term, editingEntry.value.definition)
    turnOffEditMode()
}

// A function that evaluates whether an input to a field is valid or not
// In this case, it checks to make sure the length of the input is greater than 0 and less than 2056
function invalidInput(word: string) {
    if (word.length > 0 && word.length < 2056) return false
    return true
}

// The function that handles bulk upload via a csv file
const bulkUploader = async (event) => {
    const file = event.files[0];
    // console.log(event)
    const reader = new FileReader();
    const blob = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });

    reader.onloadend = async function () {
        const base64data = reader.result;
        console.log(base64data)
        await $fetch(fullUrl('api/bulk-upload'), {
            method: 'POST',
            body: {
                data: base64data
            }
        })
        getGlossary() // not sufficient
    };
};

// A function to fetch the pre-existing glossary
// Will also alphabetize and group together the terms
async function getGlossary() {
    const data: GlossaryEntry[] = await $fetch(fullUrl('api/glossary'), {
        method: 'GET',
    })
    // Step 1: Sort all terms
    // Transform data so it is in alphabetical order by term
    orderedData.value = alphabetizeArray(data) // Never change this

    // Step 2: Group all terms together by starting letter
    glossary.value = groupByLetter(orderedData.value)
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
    getGlossary()
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
    if (newPopupVisible.value) {
        newPopupVisible.value = false
    }
    getGlossary()
}

// When searchQuery changes, update the searchedGlossary
watch(searchQuery, async() => {
    glossary.value = groupByLetter(orderedData.value.filter((entry: GlossaryEntry) => 
        entry.term.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
        entry.definition.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
})

// Functions to call on mount
onMounted(() => {
    generateSortedTermsScaffold() // Generate the object that groups entries by starting letter
    getGlossary() // Populate local glossary
})
</script>

<template>
    <div class="container mx-auto w-1/2 max-lg:w-auto">
        <!-- Search + Add Term Bar -->
        <Toolbar class="mt-3 rounded-none fixed top-0 w-1/2 z-50">
            <template #center>
                <IconField iconPosition="left">
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText placeholder="Search" v-model="searchQuery" :disabled="inEditMode()"/>
                </IconField>
            </template>
            <template #end>
                <Button icon="pi pi-file-arrow-up" class="text-slate-100 bg-sky-600 hover:bg-sky-900 mr-1" @click="bulkPopupVisible = true" :disabled="inEditMode()" />
                <Button icon="pi pi-plus" class="text-slate-100 bg-sky-600 hover:bg-sky-900" @click="newPopupVisible=true" :disabled="inEditMode()" />
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
                                        <!-- Normal Output -->
                                        <div v-if="editingEntry.id != item.id">
                                            <h2 class="text-2xl font-medium my-2">
                                                <span v-html="highlightSearchTerm(item.term)"></span>
                                                <Button v-if="!inEditMode()" icon="pi pi-pencil" class="border-0 text-slate-300" size="small" @click="turnOnEditMode(item)" />
                                            </h2>
                                            <p v-html="highlightSearchTerm(item.definition)"></p>
                                        </div>

                                        <!-- Edit Mode -->
                                        <div v-else>
                                            <div class="my-2">
                                                <InputText id="term" v-model="editingEntry.term" class="text-2xl font-medium leading-8" />
                                                <label for="term" hidden>Term</label>
                                                <Button icon="pi pi-times" class="border-0 text-rose-400 hover:text-rose-700 h-12" @click="turnOffEditMode()" />
                                                <Button icon="pi pi-check" class="border-0 text-green-600 hover:text-green-900 h-12" @click="saveEdits()" :disabled="invalidInput(editingEntry.term) || invalidInput(editingEntry.definition)"/>
                                            </div>
                                            <Textarea id="definition" v-model="editingEntry.definition" class="w-full" />
                                            <label for="definition" hidden>definition</label>
                                        </div>
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
        <Dialog v-model:visible="newPopupVisible" modal header="Add Entry" :style="{ 'max-width': '25rem' }">
            <span class="text-surface-600 dark:text-surface-0/70 block mb-5">Submit a new term and definition pair.</span>
            <label for="term" class="block text-sm font-medium leading-6 text-gray-900">Term</label>
            <InputText v-model="editingEntry.term" id="term" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2" :invalid="invalidInput(editingEntry.term)" />
            <label for="term" class="block text-sm font-medium leading-6 text-gray-900">Definition</label>
            <Textarea v-model="editingEntry.definition" id="definition" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2" :invalid="invalidInput(editingEntry.definition)" />
            <div class="flex justify-end gap-2 mt-4">
                <Button type="button" label="Cancel" class="bg-stone-100 hover:bg-stone-200" @click="newPopupVisible=false"></Button>
                <Button type="button" label="Save" class="bg-sky-100 hover:bg-sky-200" @click="addTerm(editingEntry.term, editingEntry.definition)" :disabled="invalidInput(editingEntry.term) || invalidInput(editingEntry.definition)" />
            </div>
        </Dialog>

        <!-- Bulk Import Popup -->
        <Dialog v-model:visible="bulkPopupVisible" modal header="Bulk Import" :style="{ 'max-width': '30rem' }">
            <span class="text-surface-600 dark:text-surface-0/70 block mb-5">Upload a CSV file of term and definition pairs.</span>
            <FileUpload name="demo[]" accept=".csv" :maxFileSize="1000000" @upload="bulkUploader" :multiple="false" />
            <div class="flex justify-end gap-2 mt-4">
                <Button type="button" label="Close" class="bg-stone-100 hover:bg-stone-200" @click="bulkPopupVisible = false"></Button>
            </div>
        </Dialog>
    </div>
</template>