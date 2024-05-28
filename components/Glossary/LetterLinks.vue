<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default() {
      return {}
    },
  },
})
</script>

<template>
  <!-- Links to Letter Section Toolbar -->
  <Toolbar class="border-0 mb-4">
    <template #center>
      <span v-for="letter in Object.keys(data).sort()" :key="letter">
        <a :href="`#${letter}`" class="mx-1 text-sky-600 hover:text-sky-900 underline">{{ letter }}</a>
      </span>
    </template>
  </Toolbar>
</template>
