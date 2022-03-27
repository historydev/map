export default {
    find: async (collection, item) => await collection.find(item).toArray()
}