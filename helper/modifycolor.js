function modifyNodeColors(data, specialNodes) {
    for (const year in data) {
      const nodes = data[year]["nodes"];
  
      for (const node of nodes) {
        const specialNode = specialNodes.find(special => special.id === node.id);
  
        if (specialNode && specialNode.colour) {
          node.colour = specialNode.colour;
        }
      }
    }
  
    return data;
  }

module.exports = modifyNodeColors