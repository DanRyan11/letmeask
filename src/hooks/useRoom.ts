import { useEffect, useState } from "react";
import { database } from "../services/firebase";

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  };
  content: string;
  isHighlighted: boolean,
  isAswered: boolean,
}>

type QuestionsType = {
  id: string;
  author: {
    name: string,
    avatar: string
  };
  content: string;
  isHighlighted: boolean,
  isAswered: boolean,
}

export function useRoom(roomId:any) {
  const [questions, setQuestions] = useState<QuestionsType[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    roomRef.on('value', room => {
      const databaseRoom = room.val()

      setTitle(databaseRoom.title)

      const firebaseQuestions = databaseRoom.questions as FirebaseQuestions

      if (firebaseQuestions) {

        const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAswered: value.isAswered,
          }
        })

        setQuestions(parsedQuestions)
      }

    })
  }, [roomId])

  return {
    title,
    questions
  }
}