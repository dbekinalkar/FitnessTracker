import React from 'react';
import Head from 'next/head'
import WorkoutLog from '../components/WorkoutLog';

const HomePage = () => {
  return (
    <div>
      <Head>
        <title>Workout Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="p-5 bg-blue-500 text-white">
        <h1 className="text-2xl">Workout Tracker</h1>
      </nav>
      
      <main className="mt-5">
        <WorkoutLog />
      </main>
    </div>
  );
};

export default HomePage;