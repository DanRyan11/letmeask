import '../styles/question.scss';

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    }
}


export function Question({ content, author }: QuestionProps) {
    return (
        <div className="question">
            <p>{content}</p>

            <footer className="user-info">
                <div>
                    <img src={author.avatar} alt={author.name} />
                </div>
                <div>

                </div>
            </footer>
        </div>
    )
}