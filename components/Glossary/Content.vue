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
    default: '',
  },
  editTerm: {
    type: Function,
    default: () => {
      return null
    },
  },
})

// The index of the entry we are currently editing
// If it is -1, we know we can edit a term
// Otherwise, we know that a term is currently being edited
const currentlyEditing = ref(-1)
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
              <GlossaryPair v-model:currentlyEditing="currentlyEditing" :entry="entry" :edit-term="editTerm" />
            </div>
          </div>
        </template>
      </DataView>
      <hr class="my-4">
    </div>
  </div>
</template>
