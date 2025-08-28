export default function FeaturesPage() {
  const features = [
    {
      title: "Modern Design",
      description: "Clean and intuitive user interface with a focus on user experience."
    },
    {
      title: "Fast Performance",
      description: "Optimized for speed and smooth interactions."
    },
    {
      title: "Responsive Layout",
      description: "Works seamlessly on all devices and screen sizes."
    },
    {
      title: "Easy Navigation",
      description: "Intuitive menu structure for better user flow."
    }
  ];

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Features</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
