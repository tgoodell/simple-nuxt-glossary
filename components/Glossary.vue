<script setup lang="ts">
// Glossary with Definitions and Terms
    // Features:
        // Add term + definition
        // Edit term + definition
        // Bulk import
        // Search
    // Strategy:
        // Create API endpoint with Mocks Server
        // $fetch it

const glossary = ref()        
async function getGlossary() {
  const data = await $fetch('http://localhost:3100/api/glossary', {
    method: 'GET',
  })
  glossary.value = data
}

getGlossary()
</script>

<template>
    Glossary!
    <div v-for="entry in glossary" >
        {{ entry.term }} - {{ entry.definition }}
    </div>
</template>