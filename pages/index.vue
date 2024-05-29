<script setup lang="ts">
const search = ref(null)
const { data, error, pending, refresh } = await useGlossaryApi('api/glossary', {
  query: {
    search,
  },
})

/**
 * Computes and returns organized data based on the provided data.
 * If there is an error, an empty object is returned.
 * The data is organized alphabetically by the first letter of the term.
 * Each letter is associated with an array of entries that start with that letter.
 *
 * @returns {Object} The organized data.
 */
const organizedData = computed(() => {
    if (error.value)
        return {}
    const organized = {}
    for (const entry of data.value) {
        const firstLetter = entry.term.charAt(0).toUpperCase()
        if (!(firstLetter in organized)) {
                organized[firstLetter] = [entry]
        }
        else {
                organized[firstLetter].push(entry)
        }
    }

    // Sort the data so that it is in alphabetical order
    const usedLetters = Object.keys(organized)
    usedLetters.sort()
    usedLetters.forEach((key, index) => {
        const value = organized[key]
        delete organized[key]
        organized[key] = value
    })

    return organized
})

const config = useRuntimeConfig()

/**
 * Computes the full URL that an API call should use given a suffix using the apiBase in Nuxt Config
 * 
 * @returns {string} The Full URL
 */
function fullUrl(suffix: string) {
    return config.public.apiBase + suffix
}

const addPopupVisible = ref(false)

/**
 * Add a new term + definition pair to the data on the backend.
 * Also handles the visibility of the addPopup and calls a refresh of the data once the $fetch is complete.
 * @param {string} term
 * @param {string} definition
 */
async function addTerm(term: string, definition: string) {
    await $fetch(fullUrl('api/add'), {
        method: 'POST',
        body: {
            term: term,
            definition: definition
        }
    })
    if (addPopupVisible.value) {
        addPopupVisible.value = false
    }
    refresh()
}

const showSuccess = ref(false)
// The function that handles bulk upload via a csv file
/**
 * Upload a csv file to the backend.
 * The file is grabbed from the event, then encoded into base64 via blob, and finally uploaded.
 * This function also handles the visibility of the showSuccess message and calls a refresh of the data.
 * @param {event} event
 */
async function bulkUploader (event) {
    const file = event.files[0];
    const reader = new FileReader();
    const blob = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });

    reader.onloadend = async function () {
        const base64data = reader.result;
        await $fetch(fullUrl('api/bulk-upload'), {
            method: 'POST',
            body: {
                data: base64data
            }
        })
        showSuccess.value = true
        refresh()
    };
};

const bulkPopupVisible = ref(false)
/**
 * Watches bulkPopupVisible and ties it to the visibility of the bulkPopup.
 * When !bulkPopupVisibility, we reset the value of showSuccess for the next bulk upload
 */
watch(bulkPopupVisible, async() => {
    if (showSuccess) showSuccess.value = false
})

const editingEntry = ref<GlossaryEntry>({id: -1, term: '', definition: ''}) // The entry that is currently being edited
</script>

<template>
  <div class="container mx-auto w-1/2 max-lg:w-auto">
    <GlossarySearch v-model:search="search" v-model:addPopupVisible="addPopupVisible" v-model:bulkPopupVisible="bulkPopupVisible"/>
    <GlossaryLetterLinks :data="organizedData" />
    <div class="grid grid-cols-4">
        <GlossaryContent :data="organizedData" :search="search" />
        <GlossarySidebar :data="organizedData" />
    </div>
    <GlossaryDialogAdd v-model:isVisible="addPopupVisible" :addTerm="addTerm" />
    <GlossaryDialogUpload v-model:isVisible="bulkPopupVisible" :bulkUploader="bulkUploader" :showSuccess = "showSuccess" />
  </div>
</template>
