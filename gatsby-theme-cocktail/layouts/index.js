/** @jsxImportSource @compiled/react */
import React from "react"


const Layout = ({ children }) => {

    return(
        <div>
            <div css={{
                marginLeft: "auto",
                marginRight: "auto",
                width: "fit-content",
                color: "orange"
            }}>
                <h1>Online Cocktail Shop</h1>
            </div>
            {children}
        </div>
    );
}

export default Layout