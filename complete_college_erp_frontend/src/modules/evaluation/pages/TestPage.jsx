export default function TestPage() {
  return (
    <div>
      {/* Test 1: Inline styles (should always work) */}
      <div style={{ backgroundColor: 'red', color: 'white', padding: '20px', margin: '20px' }}>
        ✅ INLINE STYLES - This should be RED
      </div>

      {/* Test 2: Tailwind utility classes */}
      <div className="bg-blue-500 text-white p-8 m-4 text-2xl">
        🔵 TAILWIND - This should be BLUE if Tailwind works
      </div>

      {/* Test 3: Multiple Tailwind classes */}
      <div className="bg-green-600 text-white rounded-lg shadow-lg p-6 m-4">
        🟢 TAILWIND COMPLEX - This should be GREEN with shadow and rounded corners
      </div>

      {/* Test 4: Responsive classes */}
      <div className="bg-yellow-500 p-4 m-4 md:bg-purple-500 md:text-white">
        🟡 RESPONSIVE - Yellow on mobile, Purple on desktop
      </div>

      {/* Test 5: Custom color from config */}
      <div className="bg-primary text-white p-4 m-4">
        🔷 CUSTOM COLOR - Should use your custom 'primary' color (#3b82f6)
      </div>

      {/* Test 6: Grid layout */}
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="bg-red-400 p-4">Box 1</div>
        <div className="bg-green-400 p-4">Box 2</div>
        <div className="bg-blue-400 p-4">Box 3</div>
      </div>
    </div>
  );
}