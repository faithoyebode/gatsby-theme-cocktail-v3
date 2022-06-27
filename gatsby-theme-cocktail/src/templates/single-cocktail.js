/** @jsxImportSource @compiled/react */
import React from 'react';
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

const SingleCocktail = (props) => {
    const singleCocktailData = props.data.cocktail
  console.log("SingleCocktail", props);
  return (
    <div css={{
        width: "100%",
        maxWidth: "1440px",
        marginLeft: "auto",
        marginRight: "auto"
      }}
    >
        <h1 css={{
            width: "fit-content",
            marginLeft: "auto",
            marginRight: "auto",
            paddingTop: "40px",
            marginBottom: "40px",
            fontSize: "42px"
            }}
        >
            {singleCocktailData.strDrink}
        </h1>
        <div 
            css={{
            width: "100%",
            }}
        >
            <div css={{
                width: "100%",
                maxWidth: "600px",
                height: "400px",
                position: "relative",
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: "16px",
                }}
            >
                <GatsbyImage css={{
                    width: "100%", 
                    height: "100%",                 
                    borderRadius: "16px"
                    }} 
                    image={singleCocktailData?.image?.childImageSharp?.gatsbyImageData ? 
                        singleCocktailData.image.childImageSharp.gatsbyImageData : 
                        singleCocktailData.image.publicURL
                    } 
                />
            </div>
              
            <p 
                dangerouslySetInnerHTML={{__html: singleCocktailData.furtherInformationHTML}}
                css={{
                  marginTop: 0, 
                  padding: "0 16px", 
                  fontSize: "18px"
                }} 
            />
        </div>
    </div>
  )
}

export const query = graphql`
  query SingleCocktailQuery($id: String!) {
    cocktail(id: {eq: $id})  {
        idDrink
        strDrink
        strDrinkThumb
        furtherInformationHTML
        image {
          publicURL
          childImageSharp {
            gatsbyImageData
          }
        }
      
    }
  }
`

export default SingleCocktail; 