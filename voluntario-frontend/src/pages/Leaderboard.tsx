import { useState } from 'react';
import { Navbar } from '../components/navbars/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/free-solid-svg-icons';

library.add(faStar);

const Leaderboard = ({ users }: { users: any[] }) => {
    return (
        <main>
            {users.map((user, index) => (
                <div key={index} className={`p-5 shadow-lg mx-auto max-w-4xl ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'}`}>
                    <div className="flex justify-between mb-4">
                        <div className="w-1/5">#{index + 1}</div>
                        <div className="w-1/5">{user.username}</div>
                        <div className="w-1/5"><FontAwesomeIcon icon="star" color="yellow" /> {user.rating}</div>
                        <div className="w-1/5">{user.points}</div>
                        <div className="w-1/5">{user.volunteerCount}</div>
                    </div>
                </div>
            ))}
            
        </main>
    );
};

const App = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [username, setUsername] = useState('');
    const [rating, setRating] = useState('');
    const [points, setPoints] = useState('');
    const [volunteerCount, setVolunteerCount] = useState('');
    
    // it is for testing before connecting to the backend
    const addUser = () => {
        const newUser = {
            username,
            rating,
            points,
            volunteerCount
        };

        // it is important to sort the users by points before updating the position
        const updatedUsers = [...users, newUser].sort((a, b) => b.points - a.points).map((user, index) => ({
            ...user,
            position: index + 1
        }));

        setUsers(updatedUsers);
        setUsername('');
        setRating('');
        setPoints('');
        setVolunteerCount('');
    };

    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <div className="mt-10 p-5 shadow-lg mx-auto max-w-4xl">
                    <div className="flex justify-between mb-4">
                        <input className="w-1/4 p-2 mr-2" type="text" placeholder="Nazwa użytkownika" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input className="w-1/4 p-2 mr-2" type="text" placeholder="Ocena" value={rating} onChange={(e) => setRating(e.target.value)} />
                        <input className="w-1/4 p-2 mr-2" type="text" placeholder="Punkty" value={points} onChange={(e) => setPoints(e.target.value)} />
                        <input className="w-1/4 p-2 mr-2" type="text" placeholder="Liczba wolontariatów" value={volunteerCount} onChange={(e) => setVolunteerCount(e.target.value)} />
                        <button className="p-2 bg-primary text-white rounded" onClick={addUser}>Dodaj</button>
                    </div>
                </div>

                {/* let's comeback to this part later and dthink about this blue color */}
                <div className="p-3 shadow-lg mx-auto max-w-4xl bg-leaderboard-blue">

                    <div className="flex justify-between">
                        <div className="w-1/5 text-sm">Pozycja</div>
                        <div className="w-1/5 text-sm">Nazwa użytkownika</div>
                        <div className="w-1/5 text-sm">Ocena</div>
                        <div className="w-1/5 text-sm">Punkty</div>
                        <div className="w-1/5 text-sm">Liczba wolontariatów</div>
                    </div>
                </div>
                
                <Leaderboard users={users} />
            </main>
        </>
    );
};

export default App;
