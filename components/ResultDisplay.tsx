export default function ResultDisplay({
  result,
}: {
  result: { name: string; description: string; attributes: string[] } | null;
}) {
  if (!result) return null;

  // Function to convert Markdown-like syntax (e.g., **bold**) into HTML
  const formatBoldText = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Analysis Results</h2>

      {/* Object Name */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
          Identified Object
        </h3>
        <p
          className="text-xl font-medium text-gray-900"
          dangerouslySetInnerHTML={{ __html: formatBoldText(result.name) }}
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
          Description
        </h3>
        <p
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatBoldText(result.description) }}
        />
      </div>

      {/* Key Characteristics */}
      {result.attributes && result.attributes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Key Characteristics
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.attributes.map((attribute, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                dangerouslySetInnerHTML={{
                  __html: formatBoldText(attribute), // Apply bold formatting
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
