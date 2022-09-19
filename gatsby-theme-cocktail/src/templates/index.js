/** @jsxImportSource @compiled/react */
import React from 'react';
import {  Link, graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import slugify from 'slugify';
import { singleCocktail } from '../templates/single-cocktail';


const Index = (props) => {
  const { allCocktail } = props.data;

  const { data, loading } = useGet((req, res) => {
    const href = graphql.post("/");
    slugify("police");
    singleCocktail();
    if(req.method) console.log(req.body);
  }, ["someDependency"]);
  
  return (
    <div css={{
        width: "100%",
      }}
    >
      <h1 css={{
          width: "fit-content",
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop: "40px",
          marginBottom: "40px"
        }}
      >
        Cocktails
      </h1>
      <div css={{
        width: "100%",
        maxWidth: "1440px",
        marginLeft: "auto",
        marginRight: "auto"
      }}>
        <div css={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          // gridTemplateRows: "500px",
          gridAutoFlow: "row dense",
          gap: "0 20px",
          "@media (max-width: 1200px)": {
            gridTemplateColumns: "1fr 1fr 1fr"
          },
          "@media (max-width: 991px)": {
            gridTemplateColumns: "1fr 1fr"
          },
          "@media (max-width: 479px)": {
            gridTemplateColumns: "1fr"
          }

        }}>
          {allCocktail.nodes.map((item, index) => (
            <Link
              to={item.furtherInformationExcerpt ? `/drink/${slugify(item.strDrink.toLowerCase())}` : "/"}
              css={{
                textDecoration: "none"
              }}
            >
            <div 
              key={index}
              css={{
                cursor: "pointer",
                height: "550px",
                marginBottom: "20px",
                "&:hover": {
                  background: "#fffff",
                  borderRadius: "16px",
                  boxShadow: "4px 5px 8px #00000020",
                  "& .excerpt": {
                    display: "block",
                  }
                }
              }}
            >
              <div css={{
                width: "100%",
                height: "400px",
                position: "relative",
                borderRadius: "16px",
                boxShadow: "4px 5px 8px #00000020",
                "div:hover &": {
                  boxShadow: "none"
                }
                
              }}>
                <GatsbyImage css={{
                    width: "100%", 
                    height: "100%",                 
                    borderRadius: "16px"
                  }} 
                  image={item?.image?.childImageSharp?.gatsbyImageData ? 
                      item.image.childImageSharp.gatsbyImageData : 
                      item.image.publicURL
                    } 
                />
              </div>
              <p css={{
                  fontSize: "24px",
                  lineHeight: "1.5",
                  fontWeight: 500,
                  marginLeft: "16px",
                  marginTop: "5px",
                  marginBottom: 0,
                  fontFamily: "sans-serif",
                  color: "black",
                  fontFamily: "Raleway"
                }}
              >
                {item.strDrink}
              </p>
              <p css={{
                  marginTop: 0, 
                  padding: "0 16px", 
                  display: "none",
                  color: "#00000090",
                }} 
                className="excerpt" 
              >
                {item.furtherInformationExcerpt ? `${item.furtherInformationExcerpt} READ MORE` : ""}
              </p>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export const query = graphql`
  query HomePageQuery {
    allCocktail {
      nodes {
        idDrink
        strDrink
        strDrinkThumb
        image {
          publicURL
          childImageSharp {
            gatsbyImageData
          }
        }
        furtherInformationExcerpt
      }
    }
  }
`

export default Index; 