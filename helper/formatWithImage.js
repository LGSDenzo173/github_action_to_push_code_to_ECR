// Formating data to support our Sankey in the frontend

const formatData = (data) => {
    // Creating JSON data for fetching sankey data
    const obj = {};
    var images = [];
    var nodes = [];
    var year = null;

    data.map((item) => {
        if (!obj[item.annee]) {
            if(year) {
                obj[year].push(images);
            }

            year = item.annee;
            images = [];
            
            obj[item.annee] = [
                { "year": parseInt(item.annee) }, 
                ["From", 'To', 'value', {
                    type: 'string',
                    role: 'style'
                }]
            ];
        }
        
        if(!nodes.includes(item.Output)) {
            images.push(item.Image);
        }

        obj[item.annee].push([item.Input, item.Output, parseFloat(item.valeur), item.Color])
    });

    obj[year].push(images);
    
    // Converting into Array to support Google-Charts-Sankey
    const result = [];
    for (const key in obj)
        result.push(obj[key]);
    
    return result;
}

module.exports = {
    formatData
}