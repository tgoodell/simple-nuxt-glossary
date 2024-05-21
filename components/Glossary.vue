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
async function getGlossary() {
  const data = await $fetch('http://localhost:3100/api/glossary', {
    method: 'GET',
  })
  glossary.value = data
}

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const onCellEditComplete = (event) => {
    let { data, newValue, field } = event;

    console.log({data, newValue, field})
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
        editMode="cell" 
        tableStyle="min-width: 50rem" 
        v-model:filters="filters" 
        stripedRows 
        showGridlines 
        paginator 
        @cell-edit-complete="onCellEditComplete"
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
        </template>
        <Column field="term" header="Term"></Column>
        <Column field="definition" header="Definition">
            <template #body="{ data, field }">
                {{ data[field] }}
            </template>
            <template #editor="{ data, field }">
                <Textarea v-model="data[field]" autofocus cols="90"/>
            </template>
        </Column>
    </DataTable>
</template>