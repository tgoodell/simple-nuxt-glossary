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
  <!-- Sidebar with List of Term Links -->
  <div class="col-span-1 ml-4">
    <h2 class="text-xl border-b-2 sticky top-20 font-sans font-medium">
      Terms
    </h2>
    <ScrollPanel class="sticky top-25 h-80-vh">
      <div v-for="(entries, letter) in data" :key="letter">
        <div v-if="entries.length > 0">
          <h3 class="font-serif">
            {{ letter }}
          </h3>
          <ul class="leading-6">
            <li v-for="entry in entries" :key="entry.id">
              <a :href="`#${slugify(entry.term)}`" class="text-sky-600 hover:text-sky-900 underline font-sans">
                {{ entry.term }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </ScrollPanel>
  </div>
</template>
