module.exports = {
    extends: ["next/core-web-vitals"],
    rules: {
      // Add custom rules here
      "jsx-a11y/alt-text": "warn", // Warn about missing alt attributes
      "react-hooks/exhaustive-deps": "warn", // Warn about missing useEffect dependencies
      "react/no-unescaped-entities": "warn", // Warn about unescaped entities
    },
  };