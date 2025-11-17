import React from "react";

const Title = ({ title, subtitle, subTitle }) => {
  const text = subtitle ?? subTitle ?? "";
  return (
    <>
      <h1 className="font-medium text-3xl">{title}</h1>
      <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-156">
        {text}
      </p>
    </>
  );
};

export default Title;
