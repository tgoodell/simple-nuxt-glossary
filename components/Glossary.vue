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
    <div class="container mx-auto w-2/5 max-lg:w-auto">
        <Toolbar class="mt-3 rounded-none sticky top-0">
            <template #center>
                <IconField iconPosition="left">
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText placeholder="Search" />
                </IconField>
            </template>
            <template #end>
                <Button icon="pi pi-plus" severity="info" @click="popupVisible=true" />
            </template>
        </Toolbar>
        <Toolbar class="border-0 mb-4">
            <template #center>
                <span v-for="(entries, letter) in glossary">
                    <a :href="'#' + letter" v-if="entries.length > 0" class="mx-1 text-sky-600 hover:text-sky-900 underline">{{ letter }}</a>
                    <span v-else>...</span>
                </span>
            </template>
        </Toolbar>
        <div v-for="(entries, letter) in glossary">
            <!-- Only show letter section if there are Glossary Entries that begin with that letter -->
            <div v-if="entries.length > 0">
                <h2 class="text-5xl font-semibold" :id="letter">{{ letter }}</h2>
                <DataView :value="entries">
                    <template #list="slotProps">
                        <div class="grid grid-nogutter">
                            <div v-for="(item, index) in slotProps.items" :key="index" class="leading-7 my-2">
                                <h2 class="text-2xl font-medium my-2">{{ item.term }}</h2>
                                <p>{{ item.definition }}</p>
                            </div>
                        </div>
                    </template>
                </DataView>
                <hr class="my-4"/>
            </div>
        </div>
        <Dialog v-model:visible="popupVisible" modal header="Add Entry" :style="{ width: '25rem' }">
            <span class="text-surface-600 dark:text-surface-0/70 block mb-5">Submit a new term and definition pair.</span>
            <label for="term">Term</label>
            <InputText v-model="newTerm" id="term" />
            <label for="term">Definition</label>
            <Textarea v-model="newDefinition" id="definition" />
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="popupVisible=false"></Button>
                <Button type="button" label="Save" @click="addTerm(newTerm, newDefinition)"></Button>
            </div>
        </Dialog>
    </div>


    <!-- <div v-for="entry in glossary" >
        <InputText type="text" v-model="entry.term" disabled /><Textarea v-model="entry.definition" cols="40" autoResize disabled />
        <Button icon="pi pi-pencil" />
    </div> -->
    <!-- <DataTable 
        :value="glossary" 
        :rows="10" 
        :rowsPerPageOptions="[5, 10, 20, 50]"
        v-model:editingRows="editingRows" 
        editMode="row"
        tableStyle="min-width: 50rem" 
        v-model:filters="filters" 
        stripedRows 
        showGridlines 
        paginator 
        @row-edit-save="onRowEditSave"
    >
        <template #header>
            <div class="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </IconField>
            </div>
            <div class="flex justify-content-end">
                <Button icon="pi pi-plus" severity="info" @click="popupVisible=true" />
            </div>
        </template>
        <Column field="term" header="Term">
            <template #body="{ data, field }">
                {{ data[field] }}
            </template>
            <template #editor="{ data, field }">
                <InputText v-model="data[field]" />
            </template>
        </Column>
        <Column field="definition" header="Definition">
            <template #body="{ data, field }">
                {{ data[field] }}
            </template>
            <template #editor="{ data, field }">
                <Textarea v-model="data[field]" class="w-full" />
            </template>
        </Column>
        <Column :rowEditor="true" bodyStyle="text-align:center"></Column>
    </DataTable>-->
</template>