import Hero3D from '../components/Hero3D';
import { Link } from 'react-router-dom';
import { FiEdit3, FiUsers, FiZap, FiCloud } from 'react-icons/fi';

export default function Home() {
  const features = [
    {
      icon: <FiEdit3 className="w-8 h-8" />,
      title: 'Real-time Collaboration',
      description: 'Work together seamlessly with your team in real-time'
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: 'AI-Powered Assistance',
      description: 'Get intelligent suggestions powered by Gemini 2.0'
    },
    {
      icon: <FiCloud className="w-8 h-8" />,
      title: 'Cloud Sync',
      description: 'Access your documents anywhere, anytime'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Team Workspace',
      description: 'Organize and share documents with your team'
    }
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
      {/* Hero Section with 3D Background */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        {/* 3D Background */}
        <div className='absolute inset-0 z-0'>
          <Hero3D />
        </div>

        {/* Hero Content */}
        <div className='relative z-10 text-center px-4 max-w-6xl mx-auto'>
          <div className='bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20'>
            <h1 className='text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'>
              Welcome to SyncDoc
            </h1>
            <p className='text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto'>
              The next-generation collaborative document editor powered by AI
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Link
                to='/register'
                className='px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300'
              >
                Get Started Free
              </Link>
              <Link
                to='/login'
                className='px-8 py-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm'
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10'>
          <div className='w-6 h-10 border-2 border-blue-600 rounded-full flex justify-center'>
            <div className='w-1 h-3 bg-blue-600 rounded-full mt-2 animate-pulse'></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-4 bg-white dark:bg-gray-900'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white'>
            Powerful Features
          </h2>
          <p className='text-xl text-center text-gray-600 dark:text-gray-400 mb-16'>
            Everything you need for modern document collaboration
          </p>
          
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 dark:border-gray-600'
              >
                <div className='text-blue-600 dark:text-blue-400 mb-4'>
                  {feature.icon}
                </div>
                <h3 className='text-xl font-bold mb-2 text-gray-900 dark:text-white'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6 text-white'>
            Ready to Transform Your Workflow?
          </h2>
          <p className='text-xl text-blue-100 mb-8'>
            Join thousands of teams already collaborating on SyncDoc
          </p>
          <Link
            to='/register'
            className='inline-block px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300'
          >
            Start Collaborating Now
          </Link>
        </div>
      </section>
    </div>
  );
}
