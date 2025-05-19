import React, { useState, useEffect, useRef } from "react";

interface WorksheetCellProps {
  value: string | number;
  editable?: boolean;
  onChange?: (newValue: string | number) => void;
  placeholder?: string;
  type?: "text" | "number" | "percentage" | "currency";
  className?: string;
}

export function WorksheetCell({
  value,
  editable = true,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
}: WorksheetCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState<string | number>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (editable) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange) {
      onChange(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);
      if (onChange) {
        onChange(currentValue);
      }
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setCurrentValue(value); // Reset to original value
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: string | number = e.target.value;
    
    // Handle numeric conversions based on type
    if (type === "number" || type === "percentage" || type === "currency") {
      // Strip any non-numeric characters except decimal point for parsing
      const numericValue = e.target.value.replace(/[^0-9.-]/g, "");
      if (numericValue === "" || numericValue === "-" || numericValue === ".") {
        newValue = numericValue;
      } else {
        const parsed = parseFloat(numericValue);
        if (!isNaN(parsed)) {
          newValue = type === "text" ? parsed.toString() : parsed;
        } else {
          newValue = "";
        }
      }
    }
    
    setCurrentValue(newValue);
  };

  const getDisplayValue = () => {
    if (currentValue === null || currentValue === undefined || currentValue === "") {
      return placeholder;
    }
    
    if (type === "percentage" && typeof currentValue === "number") {
      return `${currentValue.toFixed(1)}%`;
    } else if (type === "currency" && typeof currentValue === "number") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(currentValue);
    }
    
    return currentValue;
  };

  return (
    <div 
      className={`w-full h-full relative worksheet-cell-container ${editable ? 'cursor-text' : 'cursor-default'} ${className}`} 
      onClick={handleClick}
    >
      {isEditing && editable ? (
        <input
          ref={inputRef}
          type="text"
          value={currentValue === null ? "" : currentValue.toString()}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-0 border-0 focus:ring-0 focus:outline-none bg-blue-50"
          style={{ fontFamily: "inherit", fontSize: "inherit" }}
        />
      ) : (
        <div className={`${!currentValue ? "text-gray-400" : ""}`}>
          {getDisplayValue()}
        </div>
      )}
    </div>
  );
}