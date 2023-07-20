import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Workout {
    date: string;
    description: string;
}

const WorkoutLog = () => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [workout, setWorkout] = useState<Workout>({ date: '', description: '' });
    const [currentPage, setCurrentPage] = useState<number>(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWorkout({ ...workout, [e.target.name]: e.target.value });
    };

    const addWorkout = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (workout.date === '' || workout.description === '') {
            alert('Both fields are required!');
        } else {
            const newWorkouts = [...workouts, workout];
            setWorkouts(newWorkouts);
            setWorkout({ date: '', description: '' });
            localStorage.setItem('workouts', JSON.stringify(newWorkouts));
        }
    };

    const deleteWorkout = (index: number) => {
        const newWorkouts = workouts.filter((_, workoutIndex) => workoutIndex !== index);
        setWorkouts(newWorkouts);
        localStorage.setItem('workouts', JSON.stringify(newWorkouts));
    };

    useEffect(() => {
        const storedWorkouts = localStorage.getItem('workouts');
        if (storedWorkouts) {
            setWorkouts(JSON.parse(storedWorkouts));
        }
    }, []);

    const workoutDates = workouts.map(workout => {
        const [year, month, day] = workout.date.split('-');
        return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    });

    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (
            view === 'month' &&
            workoutDates.some(
                workoutDate =>
                    workoutDate.getUTCFullYear() === date.getUTCFullYear() &&
                    workoutDate.getUTCMonth() === date.getUTCMonth() &&
                    workoutDate.getUTCDate() === date.getUTCDate()
            )
        ) {
            return 'workout-day';
        }
    };

    const workoutsPerPage = 12;
    const totalPages = Math.ceil(workouts.length / workoutsPerPage);

    const displayedWorkouts = workouts.slice(currentPage * workoutsPerPage, (currentPage + 1) * workoutsPerPage);

    const Pagination = () => (
        <div className="m-4 flex justify-center items-center">
            <button onClick={() => setCurrentPage(oldPage => Math.max(oldPage - 1, 0))} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded m-2">Previous</button>
            <span> Page {currentPage + 1} of {totalPages} </span>
            <button onClick={() => setCurrentPage(oldPage => Math.min(oldPage + 1, totalPages - 1))} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded m-2">Next</button>
        </div>
    );

    return (
        <div className="px-5 py-5">
            <div className="flex flex-wrap justify-center space-x-5">
                <div className="mr-5">
                    <h2 className="text-2xl font-bold mb-5">Add a Workout</h2>
                    <form onSubmit={addWorkout} className="flex space-x-2 mb-5">
                        <input
                            type="date"
                            name="date"
                            value={workout.date}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            name="description"
                            value={workout.description}
                            onChange={handleChange}
                            placeholder="Workout Description"
                            className="border border-gray-300 p-2 rounded flex-grow"
                            required
                        />
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Add Workout</button>
                    </form>
                </div>

                <div>
                    <h2 className="text-2xl font-bold my-5">Your Workout Calendar</h2>
                    <Calendar tileClassName={tileClassName} key={workouts.length} />
                </div>
            </div>

            <h2 className="text-2xl font-bold my-5 text-center">Your Workouts</h2>
            <Pagination />
            {displayedWorkouts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
                    {displayedWorkouts.map((workout, index) => (
                        <div key={index} className="mb-4 border p-3 rounded">
                            <p className="font-bold">Date: {workout.date}</p>
                            <p className="mb-2">Description: {workout.description}</p>
                            <button onClick={() => deleteWorkout(index)} className="text-red-500 hover:text-red-700">Delete Workout</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No workouts logged yet.</p>
            )}
            <Pagination />
        </div>
    );
};

export default WorkoutLog;
