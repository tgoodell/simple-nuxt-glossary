<script setup lang="ts">
const search = defineModel('search')
const addPopupVisible = defineModel('addPopupVisible')
const bulkPopupVisible = defineModel('bulkPopupVisible')
</script>

<template>
  <!-- Search + Add Term Bar -->
  <Toolbar class="mt-3 rounded-none w-full z-50">
    <template #center>
      <IconField icon-position="left">
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText v-model="search" placeholder="Search" />
      </IconField>
    </template>
    <template #end>
      <Button icon="pi pi-file-arrow-up" class="text-slate-100 bg-sky-600 hover:bg-sky-900 mr-1" @click="bulkPopupVisible = true" />
      <Button icon="pi pi-plus" class="text-slate-100 bg-sky-600 hover:bg-sky-900" @click="addPopupVisible = true" />
    </template>
  </Toolbar>
</template>
