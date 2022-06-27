const path = require(`path`);

module.exports = {
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
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        `gatsby-plugin-image`,
    ]
}
