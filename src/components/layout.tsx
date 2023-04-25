import React, { useState } from "react";

export const ConfigField = ({
  label,
  value,
  onDelete,
}: {
  label: string;
  value: string;
  onDelete: () => void;
}) => {
  const [showValue, setShowValue] = useState(false);
  const abbreviatedValue = value.slice(0, 10) + "...";
  return (
    <div className="flex flex-col items-center justify-between gap-2">
      <p className="text-lg font-semibold text-white">{label}</p>
      <div className="flex items-center gap-4">
        <p className="break-all text-lg text-white">
          {showValue ? value : abbreviatedValue}
        </p>
        <button
          onClick={() => setShowValue((c) => !c)}
          className="toggle-button shrink-0 text-white"
        />
        <button
          onClick={onDelete}
          className="delete-button shrink-0 text-white"
        />
      </div>
    </div>
  );
};
