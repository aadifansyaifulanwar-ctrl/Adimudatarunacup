import { useEffect, useState } from 'react';

// FIREBASE
import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  onValue,
} from 'firebase/database';

// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// ===============================
// INITIALIZE FIREBASE
// ===============================

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function TournamentApp() {
  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [screen, setScreen] = useState('login');
  const [currentPage, setCurrentPage] = useState('dashboard');

  // ===============================
  // TEAM STATE
  // ===============================

  const [teams, setTeams] = useState(
    Array.from({ length: 32 }, (_, i) => ({
      id: i + 1,
      name: '',
    }))
  );

  // ===============================
  // MATCH STATE
  // ===============================

  const [matches, setMatches] = useState(
    Array.from({ length: 16 }, (_, i) => ({
      id: i + 1,
      team1: `Team ${i * 2 + 1}`,
      team2: `Team ${i * 2 + 2}`,
      score1: 0,
      score2: 0,
      date: '',
      time: '',
    }))
  );

  // ===============================
  // LOAD FIREBASE DATA
  // ===============================

  useEffect(() => {
    const teamsRef = ref(database, 'teams');

    onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setTeams(data);
      }
    });
  }, []);

  useEffect(() => {
    const matchesRef = ref(database, 'matches');

    onValue(matchesRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setMatches(data);
      }
    });
  }, []);

  // ===============================
  // UPDATE TEAM
  // ===============================

  const updateTeamName = (index, value) => {
    if (!isAdmin) return;

    const updatedTeams = [...teams];

    updatedTeams[index].name = value;

    setTeams(updatedTeams);

    set(ref(database, 'teams'), updatedTeams);
  };

  // ===============================
  // UPDATE MATCH
  // ===============================

  const updateMatch = (index, field, value) => {
    if (!isAdmin) return;

    const updatedMatches = [...matches];

    updatedMatches[index][field] = value;

    setMatches(updatedMatches);

    set(ref(database, 'matches'), updatedMatches);
  };

  // ===============================
  // LOGIN
  // ===============================

  const handlePublicLogin = () => {
    setIsAdmin(false);
    setScreen('dashboard');
  };

  const handleAdminLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setLoginError(false);
      setScreen('dashboard');
      return;
    }

    setLoginError(true);

    setTimeout(() => {
      setLoginError(false);
    }, 600);
  };

  // ===============================
  // LOGIN PAGE
  // ===============================

  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-[#07111f] text-white flex items-center justify-center px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-yellow-400/10" />

        <div className="absolute w-[450px] h-[450px] bg-blue-500/20 blur-3xl rounded-full -top-20 -left-20" />
        <div className="absolute w-[450px] h-[450px] bg-yellow-400/10 blur-3xl rounded-full -bottom-20 -right-20" />

        <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[35px] p-8 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-4xl font-black text-black shadow-2xl mb-6">
              AT
            </div>

            <h1 className="text-4xl font-black leading-tight">
              ADIMUDA
              <span className="text-yellow-400"> TOURNAMENT </span>
              CUP 1
            </h1>

            <p className="text-gray-400 mt-4">
              Turnamen Bola Voli Profesional
            </p>
          </div>

          <div className="space-y-5">
            <button
              onClick={handlePublicLogin}
              className="w-full py-5 rounded-2xl bg-yellow-400 text-black text-lg font-black hover:scale-[1.02] transition"
            >
              Masuk Umum
            </button>

            <div className="bg-[#101b2d] border border-white/10 rounded-3xl p-5">
              <h3 className="text-xl font-black text-yellow-400 mb-4">
                Masuk Panitia
              </h3>

              <div className="space-y-4">
                <div
                  className={`flex items-center gap-3 border rounded-2xl px-5 py-4 transition ${
                    loginError
                      ? 'border-red-500 animate-pulse'
                      : 'border-white/10 focus-within:border-yellow-400'
                  }`}
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-yellow-400 text-sm"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <button
                  onClick={handleAdminLogin}
                  className="w-full py-4 rounded-2xl border border-yellow-400 text-yellow-400 font-black hover:bg-yellow-400 hover:text-black transition"
                >
                  Login Panitia
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white px-4 py-10 overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-yellow-400/10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black">
            ADIMUDA TOURNAMENT CUP 1
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Sistem Tournament Online Firebase Realtime Database
          </p>
        </div>

        {/* MENU */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-yellow-400 hover:text-black transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => setCurrentPage('teams')}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-yellow-400 hover:text-black transition"
          >
            Daftar Tim
          </button>

          <button
            onClick={() => setCurrentPage('matches')}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-yellow-400 hover:text-black transition"
          >
            Jadwal & Score
          </button>

          <button
            onClick={() => setScreen('login')}
            className="px-5 py-3 rounded-2xl bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition"
          >
            Keluar
          </button>
        </div>

        {/* DASHBOARD */}
        {currentPage === 'dashboard' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="text-5xl mb-5">🏆</div>
              <h3 className="text-2xl font-black text-yellow-400 mb-2">
                Tournament Online
              </h3>
              <p className="text-gray-400">
                Terhubung Firebase Realtime Database.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="text-5xl mb-5">👥</div>
              <h3 className="text-2xl font-black text-yellow-400 mb-2">
                32 Tim
              </h3>
              <p className="text-gray-400">
                Semua data tersimpan otomatis.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="text-5xl mb-5">⚡</div>
              <h3 className="text-2xl font-black text-yellow-400 mb-2">
                Live Score
              </h3>
              <p className="text-gray-400">
                Score pertandingan realtime.
              </p>
            </div>
          </div>
        )}

        {/* TEAM PAGE */}
        {currentPage === 'teams' && (
          <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl overflow-x-auto">
            <h2 className="text-3xl font-black text-yellow-400 mb-6">
              Daftar Tim
            </h2>

            <table className="w-full border-collapse overflow-hidden rounded-2xl">
              <thead>
                <tr className="bg-yellow-400 text-black">
                  <th className="p-4 text-left">NO</th>
                  <th className="p-4 text-left">NAMA TIM</th>
                </tr>
              </thead>

              <tbody>
                {teams.map((team, index) => (
                  <tr key={team.id} className="border-b border-white/10">
                    <td className="p-4">{team.id}</td>

                    <td className="p-4">
                      <input
                        value={team.name}
                        onChange={(e) =>
                          updateTeamName(index, e.target.value)
                        }
                        readOnly={!isAdmin}
                        placeholder={`Team ${team.id}`}
                        className="w-full bg-transparent outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MATCH PAGE */}
        {currentPage === 'matches' && (
          <div className="grid md:grid-cols-2 gap-6">
            {matches.map((match, index) => (
              <div
                key={match.id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-yellow-400 font-black">
                    Match {match.id}
                  </span>
                </div>

                <div className="space-y-4">
                  <input
                    value={match.team1}
                    onChange={(e) =>
                      updateMatch(index, 'team1', e.target.value)
                    }
                    readOnly={!isAdmin}
                    className="w-full bg-black/30 px-4 py-3 rounded-2xl outline-none"
                  />

                  <input
                    type="number"
                    value={match.score1}
                    onChange={(e) =>
                      updateMatch(index, 'score1', e.target.value)
                    }
                    readOnly={!isAdmin}
                    className="w-full bg-black/30 px-4 py-3 rounded-2xl outline-none"
                  />

                  <div className="text-center text-yellow-400 font-black text-2xl">
                    VS
                  </div>

                  <input
                    value={match.team2}
                    onChange={(e) =>
                      updateMatch(index, 'team2', e.target.value)
                    }
                    readOnly={!isAdmin}
                    className="w-full bg-black/30 px-4 py-3 rounded-2xl outline-none"
                  />

                  <input
                    type="number"
                    value={match.score2}
                    onChange={(e) =>
                      updateMatch(index, 'score2', e.target.value)
                    }
                    readOnly={!isAdmin}
                    className="w-full bg-black/30 px-4 py-3 rounded-2xl outline-none"
                  />

                  <input
                    type="date"
                    value={match.date}
                    onChange={(e) =>
                      updateMatch(index, 'date', e.target.value)
                    }
                    readOnly={!isAdmin}
                    className="w-full bg-black/30 px-4 py-3 rounded-2xl outline-none"
                  />

                  <input
                    type="time"
                    value={match.time}
                    onChange={(e) =>
                      updateMatch(index, 'time', e.target.value)
                    }
                    readOnly={!isAdmin}
                    className="w-full bg-black/30 px-4 py-3 rounded-2xl outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
