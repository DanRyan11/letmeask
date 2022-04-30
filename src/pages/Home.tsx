import { useNavigate } from 'react-router-dom';

import illustrationImage from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImage from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

export function Home() {
  const navigate = useNavigate();
  const { signInWithGoogle, user } = useAuth();
  const [roomCode, setCoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    navigate('/rooms/new')
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    
    const trimRoomCode = roomCode.trim();

    if(trimRoomCode === '') return

    const roomRef = await database.ref(`rooms/${trimRoomCode}`).get();

    if(!roomRef.exists()) return alert('Sala não encontrada');

    navigate(`/rooms/${roomCode}`)
  }

  return (
    <div id='page-auth'>
      <aside>
        <img src={illustrationImage} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logoImg} alt="Letmeask" />
          <button className='create-room' onClick={handleCreateRoom}>
            <img src={googleIconImage} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>

          <div className='separator'>ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input 
              type="text"
              placeholder="Digite o código da sala" 
              onChange={event => setCoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type='submit'>Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}