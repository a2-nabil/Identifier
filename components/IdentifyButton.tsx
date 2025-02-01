export default function IdentifyButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
    return (
      <button
        onClick={onClick}
        className="mt-4 px-4 py-2 w-full bg-green-500 text-white rounded-md disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Identifying..." : "Identify Object"}
      </button>
    );
  }
  