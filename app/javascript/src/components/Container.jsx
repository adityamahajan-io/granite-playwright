import React from "react";

import classnames from "classnames";
import PropTypes from "prop-types";

import NavBar from "components/NavBar";

const Container = ({ children, className = "" }) => (
  <>
    <NavBar />
    <div
      data-testid="page-container"
      className={classnames("mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8", [
        className,
      ])}
    >
      <div className="mx-auto max-w-3xl">{children}</div>
    </div>
  </>
);

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Container;
