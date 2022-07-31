import React from "react"

import "../components-styles/error.css"

const NotFound: React.FC = () => {
  return (
    <div className="error">
      <h1 className="error-title">
        <span className="error-code">404</span>
        <span className="error-message">Not found</span>
      </h1>
    </div>
  )
}

export default NotFound
