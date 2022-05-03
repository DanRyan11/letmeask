import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  };
  content: string;
  isHighlighted: boolean,
  isAswered: boolean,
  likes: Record<string, {
    authorId?: string,
  }>
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
  likeCount: number,
  hasLiked: boolean
}

export function useRoom(roomId: any) {
  const { user } = useAuth()
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
            likeCount: Object.values(value.likes ?? {}).length,
            hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id)
          }
        })

        setQuestions(parsedQuestions)
      }

    })

    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id])

  return {
    title,
    questions
  }
}