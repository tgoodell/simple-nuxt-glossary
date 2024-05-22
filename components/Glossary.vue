<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api';
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

const glossary = ref()
const editingRows = ref([]);
const popupVisible = ref(false)
const newTerm = ref('')
const newDefinition = ref('')

// A function to fetch the pre-existing glossary
async function getGlossary() {
  const data = await $fetch('http://localhost:3100/api/glossary', {
    method: 'GET',
  })
  glossary.value = data
}

// A function to add a new term given its id, term, and definition
// If the given id belongs to a current entry, that entry will be edited
// Otherwise, it will return a 404 status
async function editTerm(id: number, term: string, definition: string) {
    await $fetch('http://localhost:3100/api/glossary', {
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
    await $fetch('http://localhost:3100/api/add', {
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

getGlossary()
</script>

<template>
    Glossary!
    <!-- <div v-for="entry in glossary" >
        <InputText type="text" v-model="entry.term" disabled /><Textarea v-model="entry.definition" cols="40" autoResize disabled />
        <Button icon="pi pi-pencil" />
    </div> -->
    <DataTable 
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
    </DataTable>
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
</template>