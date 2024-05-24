// A function that turns a word into kebab case
export function slugify(word: string) {
    return word.toLowerCase().replaceAll(/\s+/g, '-').replaceAll('/','-')
}