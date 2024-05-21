export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt-primevue'
  ],
  css: [
    'primevue/resources/themes/aura-light-green/theme.css',
    'primevue/resources/primevue.css',
  ],
  primevue: {
    components: {
      include: ['Button', 'Textarea', 'InputText']
    }
},
})
