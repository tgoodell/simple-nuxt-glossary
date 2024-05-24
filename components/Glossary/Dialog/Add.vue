<script setup lang="ts">
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <!-- Add Term Popup -->
  <!-- Since Primevue Dialog does not allow us pass a class, we must use an inline style -->
  <Dialog :visible="isVisible" modal header="Add Entry" :style="{ 'max-width': '25rem' }">
    <span class="text-surface-600 dark:text-surface-0/70 block mb-5">Submit a new term and definition pair.</span>
    <label for="term" class="block text-sm font-medium leading-6 text-gray-900">Term</label>
    <InputText id="term" v-model="editingEntry.term" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2" :invalid="invalidInput(editingEntry.term)" />
    <label for="term" class="block text-sm font-medium leading-6 text-gray-900">Definition</label>
    <Textarea id="definition" v-model="editingEntry.definition" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2" :invalid="invalidInput(editingEntry.definition)" />
    <div class="flex justify-end gap-2 mt-4">
      <Button type="button" label="Cancel" class="bg-stone-100 hover:bg-stone-200" @click="isVisible = false" />
      <Button type="button" label="Save" class="bg-sky-100 hover:bg-sky-200" :disabled="invalidInput(editingEntry.term) || invalidInput(editingEntry.definition)" @click="addTerm(editingEntry.term, editingEntry.definition)" />
    </div>
  </Dialog>
</template>
