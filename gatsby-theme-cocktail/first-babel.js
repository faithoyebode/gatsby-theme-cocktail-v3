const fspath = require("path");
const fse = require("fs-extra");

module.exports = function (babel) {
    const { types: t } = babel;
    
    return {
      name: "random-name", // not required
      visitor: {
        
        StringLiteral(path, state) {
          if (path.node.value.toLowerCase() === "hello") {
            path.node.value = "world";
          }
        },

        // FunctionExpression: function (path, state) {
        //   console.log("function expression");
        // },

        Identifier(path, state) {
          if(path.node.name === "useGet"){
            console.log("custom GB plugin");
            const funcExpr = path.container.arguments[0]; 
            let sliceResult = state.file.code.slice(funcExpr.loc.start.index, funcExpr.loc.end.index);

            

            //listOfNodes = list of Nodes in the function in useGet
            const nodesInBody = path.parent.arguments[0].body.body;
            let listOfNodes = [];          
            const nodeNames = nodesInBody.forEach((item, i) => {
                if(item.type === "VariableDeclaration"){
                    const result = item.declarations[0].init.callee.object.name;
                    listOfNodes.push(result)
                }
                if(item.type === "ExpressionStatement"){
                    const result = item.expression.callee.name;
                    listOfNodes.push(result)
                } 
              
            });
 
            //importStatements = import statements in the whole file
            const bodySection = state.file.scope.block.body;
            const importStatements = [];
			      bodySection.forEach((item, index) => {
				      if(item.type.toLowerCase() === "importdeclaration"){
					      const importedNodes = item.specifiers;
                let shouldBeImported = false
                // console.log("importedNodes", index, item.specifiers[0]); 
                importedNodes.forEach((nodeItem) => {
						      const getItem = nodeItem.local.name
                  
                  if(listOfNodes.includes(getItem)){
                    shouldBeImported = true
                  }
					      })
					      if(shouldBeImported){
						      let itemsConstructor = {
							      namedImport: [],
							      defaultImport: []
						      }
                  //console.log("listOfNodes", importedNodes); 
						      item.specifiers.forEach((specifiedItem) => {
                    if(specifiedItem.type.toLowerCase() === "importspecifier"){
								      itemsConstructor.namedImport.push(specifiedItem.local.name);
							      }else{
								      itemsConstructor.defaultImport.push(specifiedItem.local.name);
							      }
							
						      })
						      let sourceUrl = item.source.value
                  let importString = "import"
						      itemsConstructor.defaultImport.forEach((item) => {
							      importString = importString + " " + item; 
							      if(itemsConstructor.namedImport.length > 0){
								      importString = importString + ","
							      }
						      })
                  if(itemsConstructor.namedImport.length > 0){
                    importString = importString + " " + "{";
                    itemsConstructor.namedImport.forEach((item, i) => {
                      importString = importString + " " + item;
                      if(itemsConstructor.namedImport.length > 1 && i < itemsConstructor.namedImport.length - 1){
                        importString = importString + ","
                      } 
                    })
                    importString = importString + " " + "}"
                  }
						      

                  if(sourceUrl.charAt(0) === "."){
                    const fromUrl = fspath.dirname(JSON.stringify(state.file.opts.filename));
                    const toUrl = fspath.join(fspath.dirname(JSON.stringify(state.file.opts.filename)), sourceUrl);
                    sourceUrl = fspath.relative(fromUrl, toUrl);
                  }
                  
						      importString = importString + " from " + '"' + sourceUrl + '"';
						      importStatements.push(importString);
                  
                }
				      }
			      })
            
            //console.log("importStatements", importStatements); 
            




            // const from = fspath.dirname(JSON.stringify(state.file.opts.filename));
            // const to = fspath.join(fspath.dirname(JSON.stringify(state.file.opts.filename)), "../layouts/index.js");
            // console.log("funcExpr.start", fspath.relative(from, to));
            let transformedCode = "";
            importStatements.forEach((item) => {
              transformedCode += item + "\n";
            });

            transformedCode += "const handler = " + sliceResult + " \n export default handler";
            fse.outputFileSync("./src/api/demo-api.js", transformedCode);

            const replacementString = babel.template.statement.ast(`
                (async () => {
                  const result = await axios.post("/api/demo-api", {name: "Faith Oyebode", profession: "Software Engineering"});
                  return {
                    data: result,
                    loading: false
                  }
                })()
            `);

            path.replaceWith(replacementString);
          }
        }
      }
    };
}
  
