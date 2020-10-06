import * as React from "react";
import "./ErrorText.css";

type Props = {
  error: Error;
};

export default ({ error }: Props) => (
  <div className="error">{error.toString()}</div>
);
