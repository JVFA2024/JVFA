import { User } from "lucide-react";

export const UserMessages = ({ isRTL, message }) => {
  return (
    <>
      {isRTL ? (
        <>
          <User size={40} color="#49454F" />
          <div>
            <p
              className="bg-[#F2F2F3] p-2 rounded text-right"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {message.text}
            </p>
            <p className="text-sm ml-3">{message.time}</p>
          </div>
        </>
      ) : (
        <>
          <div>
            <p
              className="bg-[#F2F2F3] p-2 rounded"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {message.text}
            </p>
            <p className="text-sm ml-3">{message.time}</p>
          </div>
          <User size={40} color="#49454F" />
        </>
      )}
    </>
  );
};
