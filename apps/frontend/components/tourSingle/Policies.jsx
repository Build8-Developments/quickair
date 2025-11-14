import React from "react";

export default function Policies({ policies }) {
  if (!policies) return null;

  return (
    <>
      <div className="line mt-60 mb-60"></div>
      <h2 className="text-30">Policies & Important Information</h2>
      <div
        className="text-15 mt-20"
        dangerouslySetInnerHTML={{ __html: policies }}
      />
    </>
  );
}
