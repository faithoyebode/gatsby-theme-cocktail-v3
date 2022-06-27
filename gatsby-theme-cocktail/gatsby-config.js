const path = require(`path`);

module.exports = function({ font = "Yellowtail"}){
    return ({
    siteMetadata: {
		title: `Online Cocktail shop`,
		siteUrl: `http://localhost:9000`, // url used to generate sitemap
	},
    plugins: [
        {
            resolve: 'gatsby-source-filesystem', 
            options: { 
              name: `pages`,
              path: `${__dirname}/src`,
              ignore: [`**/.*`],
             },
        },
        {
            resolve: `gatsby-plugin-layout`,
            options: {
              component: path.resolve(__dirname, `src/layouts/index.js`),
            },
        },
        {
            resolve: `gatsby-plugin-webfonts`,
            options: {
                fonts: {
                    google: [
                        {
                            family: font,
                            variants: ["300", "400", "500"],
                        },
                    ],
                },
            }
        },
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        `gatsby-plugin-image`,
        `gatsby-plugin-sitemap`,
        `gatsby-plugin-robots-txt`
    ]
});}
