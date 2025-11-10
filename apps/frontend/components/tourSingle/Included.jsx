import React from "react";

export default function Included({ inclusions, exclusions }) {
  const hasInclusions = inclusions && inclusions.length > 0;
  const hasExclusions = exclusions && exclusions.length > 0;

  if (!hasInclusions && !hasExclusions) return null;

  return (
    <div className="row x-gap-130 y-gap-20 pt-20">
      {hasInclusions && (
        <div className={hasExclusions ? "col-lg-6" : "col-12"}>
          <h4 className="text-18 fw-500 mb-15">Included</h4>
          <div className="y-gap-15">
            {inclusions.map((item, i) => (
              <div key={i} className="d-flex">
                <i className="icon-check flex-center text-10 size-24 rounded-full text-green-2 bg-green-1 mr-15"></i>
                <span className="text-15">{item.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasExclusions && (
        <div className={hasInclusions ? "col-lg-6" : "col-12"}>
          <h4 className="text-18 fw-500 mb-15">Not Included</h4>
          <div className="y-gap-15">
            {exclusions.map((item, i) => (
              <div key={i} className="d-flex">
                <i className="icon-close flex-center text-10 size-24 rounded-full text-red-3 bg-red-4 mr-15"></i>
                <span className="text-15">{item.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
