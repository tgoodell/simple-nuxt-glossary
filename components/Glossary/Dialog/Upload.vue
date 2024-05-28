<script setup lang="ts">
const props = defineProps({
  bulkUploader: {
    type: Function,
  },
  showSuccess: {
    type: Boolean,
    default: false,
  },
})

const isVisible = defineModel('isVisible')
</script>

<template>
  <!-- Bulk Import Popup -->
  <Dialog v-model:visible="isVisible" modal header="Bulk Import" :style="{ 'max-width': '30rem' }">
    <div v-if="!showSuccess">
      <span class="text-surface-600 dark:text-surface-0/70 block mb-5">Upload a CSV file of term and definition pairs.</span>
      <FileUpload name="data[]" accept=".csv" :max-file-size="1000000" :multiple="false" custom-upload @uploader="bulkUploader($event)" />
    </div>
    <div v-else>
      Your file was uploaded successfully. Please close this dialog to see imported data.
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <Button type="button" label="Close" class="bg-stone-100 hover:bg-stone-200" @click="isVisible = false" />
    </div>
  </Dialog>
</template>
