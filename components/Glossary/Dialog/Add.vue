<script setup lang="ts">
const props = defineProps({
  addTerm: {
    type: Function,
    default: () => {
      return null
    },
  },
})

const isVisible = defineModel('isVisible')
const newEntry = ref < GlossaryEntry > ({ id: -1, term: '', definition: '' }) // The entry that is currently being edited
</script>

<template>
  <!-- Add Term Popup -->
  <!-- Since Primevue Dialog does not allow us pass a class, we must use an inline style -->
  <Dialog v-model:visible="isVisible" modal header="Add Entry" :style="{ 'max-width': '25rem' }">
    <span class="text-surface-600 dark:text-surface-0/70 block mb-5">Submit a new term and definition pair.</span>
    <label for="term" class="block text-sm font-medium leading-6 text-gray-900">Term</label>
    <InputText id="term" v-model="newEntry.term" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2" />
    <label for="term" class="block text-sm font-medium leading-6 text-gray-900">Definition</label>
    <Textarea id="definition" v-model="newEntry.definition" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2" />
    <div class="flex justify-end gap-2 mt-4">
      <Button type="button" label="Cancel" class="bg-stone-100 hover:bg-stone-200" @click="isVisible = false" />
      <Button type="button" label="Save" class="bg-sky-100 hover:bg-sky-200" @click="addTerm(newEntry.term, newEntry.definition)" />
    </div>
  </Dialog>
</template>
