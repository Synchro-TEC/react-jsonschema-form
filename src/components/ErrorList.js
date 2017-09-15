import React from "react";

export default function ErrorList(props) {
  const { errors } = props;
  return (
    <div className="sv-messagebox error">
      <header>
        <h6 className="panel-title">Erros</h6>
      </header>
      <main>
        <ul>
          {errors.map((error, i) => {
            return <li key={i}>{error.stack}</li>;
          })}
        </ul>
      </main>
    </div>
  );
}
