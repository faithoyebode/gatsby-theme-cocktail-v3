const path = require(`path`);
const slugify = require("slugify");
const axios = require('axios');
const striptags = require('striptags');
const { createRemoteFileNode } = require('gatsby-source-filesystem');


exports.onPreInit = () => {
    console.log("Loading gatsby-cocktail-theme plugin");
}

exports.onCreateBabelConfig = ({ actions }) => {
    actions.setBabelPlugin({
      name: `@compiled/babel-plugin`,
      options: {}
    });
    actions.setBabelPlugin({
        name: require.resolve("./first-babel.js"),
        options: {
            root: ['./']
        },
    });
    actions.setBabelPreset({
        name: `babel-preset-gatsby`,
        options: {
            reactRuntime:"automatic",
            targets: {
                browsers: [">0.25%", "not dead"]
            }
        }
    })
  }

//types
const DRINK_NODE_TYPE = `Cocktail`

exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes, createFieldExtension } = actions;
    typeDefs = `
        type Cocktail implements Node @dontInfer {
            id: ID!
            idDrink: String!
            strDrink: String!
            strDrinkThumb: String!
            furtherInformationHTML: String!
            furtherInformationExcerpt: String!
            relatedCocktails: [RelatedCocktail]
        }

        type RelatedCocktail implements Node {
            idDrink: String!
            strDrink: String!
            strDrinkThumb: String!
            image: File!
        }
    `;

    createTypes(typeDefs);

}

exports.sourceNodes = async ({
    actions,
    createContentDigest,
    createNodeId,
    getNodesByType,
}) => {
    const { createNode } = actions
    let data;

    try {
        const result = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail");
        data = result.data;
    } catch (error) {
        console.log('error', error);
        return;
    }

    // Recurse through data and create Gatsby nodes.
    data.drinks.forEach(async (drink) => {
        let furtherInformationHTML = "";
        const furtherInformation = await axios.get(encodeURI(`https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=${drink.strDrink.toLowerCase()}`));
        furtherInformationHTML = furtherInformation?.data?.parse?.text['*'] ? furtherInformation.data.parse.text['*'] : "";
        const furtherInformationExcerpt = furtherInformationHTML ? `${striptags(furtherInformationHTML).substring(0, 100)}...` : "";

        const relatedDrinks = [
            data.drinks[Math.floor(Math.random()*(15 - 0) + 0)],
            data.drinks[Math.floor(Math.random()*(30 - 16) + 16)],
            data.drinks[Math.floor(Math.random()*(data.drinks.length - 31) + 31)]
        ]

        return createNode({
            ...drink,
            furtherInformationHTML: furtherInformationHTML,
            furtherInformationExcerpt: furtherInformationExcerpt,
            relatedCocktails : relatedDrinks,
            id: createNodeId(`${DRINK_NODE_TYPE}-${drink.idDrink}`),
            parent: null,
            children: [],
            internal: {
                type: DRINK_NODE_TYPE,
                content: JSON.stringify({
                    ...drink,
                    furtherInformationHTML: furtherInformationHTML,
                    furtherInformationExcerpt: furtherInformationExcerpt
                }),
                contentDigest: createContentDigest({
                    ...drink,
                    furtherInformationHTML: furtherInformationHTML,
                    furtherInformationExcerpt: furtherInformationExcerpt
                })
            },
        })}
    )
    return
}    



exports.createResolvers = ({
    actions,
    cache,
    createNodeId,
    createResolvers,
    store,
    reporter,
}) => {
    const { createNode } = actions;
    let strippedHTMLArray = [];

    const resolvers = {
        Cocktail: {
            image: {
                type: `File`,
                resolve: async (source) => {
                    const fileNode = await createRemoteFileNode({
                    // The remote image URL for which to generate a node.
                        url: `${source.strDrinkThumb}`,
                        parentNodeId: source.id,
                        createNode,
                        createNodeId,
                        cache,
                        reporter
                    })
                   
                    return fileNode;
                },
            }
        },
        RelatedCocktail: {
            image: {
                type: `File`,
                resolve: async (source) => {
                    const fileNode = await createRemoteFileNode({
                    // The remote image URL for which to generate a node.
                        url: `${source.strDrinkThumb}`,
                        parentNodeId: source.id,
                        createNode,
                        createNodeId,
                        cache,
                        reporter
                    })
                    
                    return fileNode;
                }
            }
        
        }
    };
    createResolvers(resolvers);
};

exports.createPages = async ({ graphql, actions, reporter }) => {
    const { createPage } = actions
    const indexPageTemplate = path.resolve(__dirname, `src/templates/index.js`)
    createPage({
    // Path for this page — required
        path: "/",
        component: indexPageTemplate,
        context: {}
    });
    const allDrinks = await graphql(`{
        allCocktail {
            nodes {
            id
            strDrink
            furtherInformationExcerpt
            }
        }
    }`);


    allDrinks.data.allCocktail.nodes.forEach((drink, i) => {
        if(drink.furtherInformationExcerpt){
            createPage({
                path: `/drink/${slugify(drink.strDrink.toLowerCase())}`,
                component: path.resolve(__dirname, `src/templates/single-cocktail.js`),
                context: {id: drink.id}
            })
        }
    })

    // console.log("reporter", reporter);

}

