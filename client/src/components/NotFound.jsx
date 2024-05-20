import React from "react";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404 - Page Not Found</h1>
        <p className="not-found-text">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <p className="not-found-text">Please try the following:</p>
        <ul className="not-found-list">
          <li>Double-check the URL for typos</li>
          <li>
            Navigate back to the <a href="/">home page</a>
          </li>
          <li>
            Contact the website administrator if you believe that this is an
            error
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NotFound;
