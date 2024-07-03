// Formating data to support our Sankey in the frontend
const formatData = (tableData) => {
    const graphData = {};
    
    tableData.forEach(function(row) {
        const year = row.annee.toString();
        if (!graphData[year]) {
            graphData[year] = { nodes: [], links: [] };
        }
    
        const source = row.Input.trim();
        const destination = row.Output.trim();
        const value = Number(row.valeur);
        const color = row.Color.trim();
        const image = row.Image.trim();
    
        const sourceIndex = graphData[year].nodes.findIndex(function(node) {
            return node.id === source;
        });
    
        if (sourceIndex === -1) {
            graphData[year].nodes.push({ id: source, image: `${image}` });
        }
    
        const targetIndex = graphData[year].nodes.findIndex(function(node) {
            return node.id === destination;
        });
    
        if (targetIndex === -1) {
            graphData[year].nodes.push({ id: destination, image: `${image}` });
        }
    
        graphData[year].links.push({ source: source, target: destination, value: value, color: color });
    });
    
    return graphData;      
}

module.exports = {
    formatData
}