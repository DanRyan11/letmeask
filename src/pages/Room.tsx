import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';



type RoomParams = {
  id: string;
}

export function Room() {
  const { user } = useAuth()
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('')
  const roomId = params.id

  const { title, questions } = useRoom(roomId)


  async function handleCreateNewQuestion(event: FormEvent) {
    event.preventDefault()

    const trimQuestion = newQuestion.trim()

    if (trimQuestion === '') return

    if (!user) throw new Error("Você precisa estar logado");

    const question = {
      content: trimQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span> {questions.length} pergunta(s)</span>}
        </div>

        <form action="" onSubmit={handleCreateNewQuestion}>
          <textarea
            placeholder='O que você quer perguntar'
            value={newQuestion}
            onChange={event => setNewQuestion(event.target.value)}
          />
          <div className='form-footer'>
            {
              user ? (
                <div className='user-info'>
                  <img src={user.avatar} alt={user.name} />
                  <span>{user.name}</span>
                </div>
              ) : (
                <span>Para enviar uma pergunta, <button>faça o seu login</button>.</span>
              )
            }
            <Button type='submit'>Enviar pergunta</Button>
          </div>

        </form >

        <div className="question-list">
          {
            questions.map(question => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                />
              )
            })
          }
        </div>
      </main >
    </div >
  )
}