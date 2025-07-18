import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Minus,
  ArrowUp,
} from "lucide-react";

type TextAlign = "left" | "center" | "right" | "justify";
type LetterSpacingValue =
  | "veryTight"
  | "tight"
  | "normal"
  | "loose"
  | "veryLoose";
type LineHeightValue = "veryTight" | "tight" | "normal" | "loose" | "veryLoose";

type LetterSpacingProps = {
  theme: string;
  letterSpacing: LetterSpacingValue;
  handleLetterSpacingChange: (value: LetterSpacingValue) => void;
  textAlign: TextAlign;
  handleTextAlignChange: (align: TextAlign) => void;
  lineHeight: LineHeightValue;
  handleLineHeightChange: (value: LineHeightValue) => void;
  handleTextTransformation: (
    value: "uppercase" | "lowercase" | "capitalize"
  ) => void;
  transformation: "uppercase" | "lowercase" | "capitalize" | undefined;
};

const LetterSpacing = ({
  theme,
  letterSpacing,
  handleLetterSpacingChange,
  textAlign,
  handleTextAlignChange,
  lineHeight,
  handleLineHeightChange,
  handleTextTransformation,
  transformation,
}: LetterSpacingProps) => {
  const letterSpacingOptions = [
    {
      value: "veryTight" as const,
      label: "A a",
      className: "tracking-[-0.05em]",
      tooltip: "Very Tight",
    },
    {
      value: "tight" as const,
      label: "A a",
      className: "tracking-[-0.025em]",
      tooltip: "Tight",
    },
    {
      value: "normal" as const,
      label: "A a",
      className: "tracking-normal",
      tooltip: "Normal",
    },
    {
      value: "loose" as const,
      label: "A a",
      className: "tracking-[0.025em]",
      tooltip: "Loose",
    },
    {
      value: "veryLoose" as const,
      label: "A a",
      className: "tracking-[0.05em]",
      tooltip: "Very Loose",
    },
  ];

  const alignmentOptions = [
    { align: "left" as const, icon: AlignLeft, tooltip: "Align Left" },
    { align: "center" as const, icon: AlignCenter, tooltip: "Align Center" },
    { align: "right" as const, icon: AlignRight, tooltip: "Align Right" },
    { align: "justify" as const, icon: AlignJustify, tooltip: "Justify" },
  ];

  const texttransformationOptions = [
    {
      value: "uppercase" as const,
      label: "AA",
      className: "uppercase font-semibold",
      tooltip: "Uppercase",
    },
    {
      value: "lowercase" as const,
      label: "aa",
      className: "lowercase",
      tooltip: "Lowercase",
    },
    {
      value: "capitalize" as const,
      label: "Aa",
      className: "capitalize",
      tooltip: "Capitalize",
    },
    {
      value: undefined,
      label: <Minus size={16} />,
      className: "normal-case",
      tooltip: "Normal",
    },
  ];

  const lineHeightOptions = [
    {
      value: "veryTight" as const,
      icon: (
        <div className="flex flex-col items-center">
          <div className="h-1 w-4 bg-current mb-0.5"></div>
          <div className="h-1 w-4 bg-current"></div>
        </div>
      ),
      className: "leading-[0.5]",
      tooltip: "Very Tight",
    },
    {
      value: "tight" as const,
      icon: (
        <div className="flex flex-col items-center">
          <div className="h-1 w-4 bg-current mb-1"></div>
          <div className="h-1 w-4 bg-current"></div>
        </div>
      ),
      className: "leading-[0.8]",
      tooltip: "Tight",
    },
    {
      value: "normal" as const,
      icon: (
        <div className="flex flex-col items-center">
          <div className="h-1 w-4 bg-current mb-1.5"></div>
          <div className="h-1 w-4 bg-current"></div>
        </div>
      ),
      className: "leading-normal",
      tooltip: "Normal",
    },
    {
      value: "loose" as const,
      icon: (
        <div className="flex flex-col items-center">
          <div className="h-1 w-4 bg-current mb-2"></div>
          <div className="h-1 w-4 bg-current"></div>
        </div>
      ),
      className: "leading-[1.8]",
      tooltip: "Loose",
    },
    {
      value: "veryLoose" as const,
      icon: (
        <div className="flex flex-col items-center">
          <div className="h-1 w-4 bg-current mb-2.5"></div>
          <div className="h-1 w-4 bg-current"></div>
        </div>
      ),
      className: "leading-[2.5]",
      tooltip: "Very Loose",
    },
  ];

  const getButtonClasses = (isActive: boolean) => {
    const baseClasses =
      "relative p-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 group hover:scale-105";
    const activeClasses =
      theme === "dark"
        ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25"
        : "bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/25";
    const inactiveClasses =
      theme === "dark"
        ? "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-gray-500"
        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  const getLabelClasses = () => {
    return `flex items-center gap-2 text-sm font-medium mb-3 mt-6 first:mt-0 ${theme === "dark" ? "text-gray-200" : "text-gray-700"
      }`;
  };

  const getSectionClasses = () => {
    return `p-4 rounded-xl border ${theme === "dark"
        ? "bg-gray-900/50 border-gray-700/50"
        : "bg-gray-50/50 border-gray-200/50"
      }`;
  };

  return (
    <div className="space-y-1">
      {/* Letter Spacing Section */}
      <div className={getSectionClasses()}>
        <label className={getLabelClasses()}>
          <Type size={16} />
          Letter Spacing
        </label>
        <div className="flex gap-1">
          {letterSpacingOptions.map(({ value, label, className, tooltip }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleLetterSpacingChange(value)}
              className={getButtonClasses(letterSpacing === value)}
              title={tooltip}
            >
              <span className={`text-sm font-medium ${className}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Text Alignment Section */}
      <div className={getSectionClasses()}>
        <label className={getLabelClasses()}>
          <AlignLeft size={16} />
          Text Alignment
        </label>
        <div className="flex gap-2">
          {alignmentOptions.map(({ align, icon: Icon, tooltip }) => (
            <button
              key={align}
              type="button"
              onClick={() => handleTextAlignChange(align)}
              className={getButtonClasses(textAlign === align)}
              title={tooltip}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Line Height Section */}
      <div className={getSectionClasses()}>
        <label className={getLabelClasses()}>
          <ArrowUp size={16} />
          Line Height
        </label>
        <div className="flex gap-1">
          {lineHeightOptions.map(({ value, icon, tooltip }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleLineHeightChange(value)}
              className={getButtonClasses(lineHeight === value)}
              title={tooltip}
            >
              <div className="flex items-center justify-center">{icon}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Text Transformation Section */}
      <div className={getSectionClasses()}>
        <label className={getLabelClasses()}>
          <Type size={16} />
          Text Transform
        </label>
        <div className="flex gap-2">
          {texttransformationOptions.map(
            ({ value, label, className, tooltip }) => (
              <button
                key={String(value)}
                type="button"
                onClick={() => {
                  if (value !== undefined) {
                    handleTextTransformation(value);
                  }
                }}
                className={getButtonClasses(transformation === value)}
                title={tooltip}
              >
                <span className={`text-sm font-medium ${className}`}>
                  {typeof label === "string" ? label : label}
                </span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default LetterSpacing;
