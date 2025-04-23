import ViewMessage from "../../model/ViewMessage";

type Props = {
    message : ViewMessage   
};

const MessageBox : React.FC<Props> = ({message}) => {
    const messageStyle = message.type === "user" ? "items-end" : "items-start";

    return (
        <div className={`w-full flex gap-2 flex-col ${messageStyle}`}>
            <Avatar type={message.type}/>
            <MessageText message={message.message} />
            {message.subMessage && <MessageText message={message.subMessage} />}
        </div>
    )
}

export default MessageBox;

// Modules
// MessageBox.tsxの中で使用されるコンポーネントを定義します。
// ----
interface MessageBoxProps {
 message: string;
}

const MessageText: React.FC<MessageBoxProps> = ({ message }) => {
 return ( 
    <div className="bg-gray-200 rounded-xl px-4 py-2 max-w-[90%] w-fit break-words whitespace-pre-wrap">
        {message}
    </div>
 );
};

// ----
interface AvatarProps {
  type: "user" | "assistant";
}

const Avatar: React.FC<AvatarProps> = ({type}) => {

  return (
      <div className={`rounded-full object-cover w-8 h-8 bg-gray-300 text-white flex items-center justify-center`}>
        <img
        src={type === "user" ? "/icons/user.svg" : "/icons/bot.svg"}
      />
      </div>
  );
};

