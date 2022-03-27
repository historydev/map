export default function(item, schema) {
    const validatedItem = {};
    for(let key in schema) {
        if(item[key] && typeof schema[key] === typeof item[key]) {
            validatedItem[key] = item[key];
        }
    }
    if(Object.keys(item).length === Object.keys(schema).length) {
        return validatedItem;
    }
}