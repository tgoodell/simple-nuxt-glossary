<script setup lang="ts">
const model = defineModel()
</script>

<template>
  <!-- Search + Add Term Bar -->
  <Toolbar class="mt-3 rounded-none w-full z-50">
    <template #center>
      <IconField icon-position="left">
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText v-model="model" placeholder="Search" />
      </IconField>
    </template>
    <template #end>
      <Button icon="pi pi-file-arrow-up" class="text-slate-100 bg-sky-600 hover:bg-sky-900 mr-1" />
      <Button icon="pi pi-plus" class="text-slate-100 bg-sky-600 hover:bg-sky-900" />
    </template>
  </Toolbar>
</template>
