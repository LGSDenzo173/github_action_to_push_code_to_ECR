// Formating data to support our Sankey in the frontend

const formatData = (data) => {
    // Creating JSON data for fetching sankey data
    const obj = {};
    data.map((item) => {
        if (!obj[item.annee]) {
            obj[item.annee] = [
                { "year": parseInt(item.annee) }, 
                ["From", 'To', 'value', {
                    type: 'string',
                    role: 'style'
                }]
            ];
        }

        obj[item.annee].push([item.Input, item.Output, parseFloat(item.valeur), item.Color, item.Image])
    });
    
    // Converting into Array to support Google-Charts-Sankey
    const result = [];
    for (const key in obj)
        result.push(obj[key]);
    
    return result;
}

module.exports = {
    formatData
}