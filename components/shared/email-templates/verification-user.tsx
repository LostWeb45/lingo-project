import React from "react";

interface Props {
  code: string;
  className?: string;
}

export const VerificationUserTemplate: React.FC<Props> = ({
  code,
  className,
}) => {
  return (
    <div>
      <p>
        Код подтверждения <h2>{code}</h2>
      </p>
    </div>
  );
};
