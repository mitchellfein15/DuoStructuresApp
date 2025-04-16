import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-5xl font-bold mb-6">
                Master Data Structures & Algorithms
              </h1>
              <p className="text-xl mb-8">
                Learn data structures and algorithms in a fun, interactive way. Practice implementing, analyzing, and optimizing solutions to build your problem-solving skills.
              </p>
              <button className="btn-secondary text-lg">
                Get Started
              </button>
            </div>
            <div className="md:w-1/2">
              <div className="relative h-[400px] w-full">
                <Image
                  src="/hero-image.svg"
                  alt="Data Structures & Algorithms Learning"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why learn with us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-4">Structured Learning</h3>
              <p className="text-gray-600">
                Our system guides you through fundamental concepts to advanced topics in a logical progression.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-4">Interactive Practice</h3>
              <p className="text-gray-600">
                Hands-on coding exercises and real-world problem-solving challenges.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-4">Performance Analysis</h3>
              <p className="text-gray-600">
                Learn to analyze time and space complexity of your solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to start learning?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of learners and start your journey to mastering data structures and algorithms today.
          </p>
          <button className="btn-primary text-lg">
            Create Free Account
          </button>
        </div>
      </section>
    </div>
  )
} 