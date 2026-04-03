import { useParams } from 'react-router-dom';

export default function EditorPage() {
  const { id } = useParams();

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>
        Editor — Doc ID: {id}
      </h1>
    </div>
  );
}
