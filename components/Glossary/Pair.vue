<script setup lang="ts">
const props = defineProps({
  entry: {
    type: Object,
    default: {},
  },
  editTerm: {
    type: Function,
    default: () => {
      return null
    },
  },
})

const currentlyEditing = defineModel('currentlyEditing')
const editingEntry = ref < GlossaryEntry > ({ id: -1, term: '', definition: '' })

/**
 * Enter edit mode
 * @param {GlossaryEntry} entry - The current entry we want to modify
 */
function enterEditMode(entry: GlossaryEntry) {
    currentlyEditing.value = entry.id
    editingEntry.value = JSON.parse(JSON.stringify(entry))
}

/**
 * Are we editing the entry that is being rendered within this cycle of the component?
 * @returns {boolean} if we are editing the current entry
 */
const isEditingThis = computed(() => {
    return currentlyEditing.value === props.entry.id
})

/**
 * Are we editing any entry?
 * @returns {boolean} if we are editing any entry
 */
const isEditingSomething = computed(() => {
    return currentlyEditing.value !== -1
})


/**
 * Exit edit mode by resetting currentlyEditing and editingEntry
 */
function exitEditMode() {
    currentlyEditing.value = -1
    editingEntry.value = { id: -1, term: '', definition: '' }
}

/**
 * Save and submit edits using the passed in editTerm()
 */
function saveEdits() {
    props.editTerm(editingEntry.value.id, editingEntry.value.term, editingEntry.value.definition)
    exitEditMode()
}

</script>

<template>
  <!-- Normal Output -->
  <div v-if="!isEditingThis">
    <h2 class="text-2xl font-medium my-2">
      {{ entry.term }}
      <Button icon="pi pi-pencil" class="border-0 text-slate-300" size="small" @click="enterEditMode(entry)" :disabled="isEditingSomething" />
    </h2>
    <p>{{ entry.definition }}</p>
  </div>

  <!-- Edit Mode -->
  <div v-else>
    <div class="my-2">
      <InputText id="term" v-model="editingEntry.term" class="text-2xl font-medium leading-8" size="small" />
      <label for="term" hidden>Term</label>
      <Button icon="pi pi-times" class="border-0 text-rose-400 hover:text-rose-700 h-12" @click="exitEditMode()" />
      <Button icon="pi pi-check" class="border-0 text-green-600 hover:text-green-900 h-12" @click="saveEdits()" />
    </div>
    <Textarea id="definition" v-model="editingEntry.definition" class="w-full" size="small" />
    <label for="definition" hidden>definition</label>
  </div>
</template>
