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
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        `gatsby-plugin-image`
    ]
}
