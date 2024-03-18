import React from "react";
import { useNavigate } from "react-router-dom";

const VideoCard = ({
  thumbnail,
  title,
  duration,
  views = 0,
  channelName,
  channelAvatar,
  createdAt,
  videoId,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full" onClick={() => navigate(`/watch/${videoId}`)}>
        <div className="relative mb-2 w-full pt-[56%]">
          <div className="absolute inset-0">
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full rounded-md"
            />
          </div>
          <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
            {duration}
          </span>
        </div>
        <div className="flex gap-x-2">
          <div className="h-10 w-10 shrink-0">
            <img
              src={channelAvatar}
              alt={channelName}
              className="h-full w-full rounded-full"
            />
          </div>
          <div className="w-full">
            <h6 className="mb-1 font-semibold">{title}</h6>
            <p className="flex text-sm text-gray-200">
              {views} Views · {createdAt} minutes ago
            </p>
            <p className="text-sm text-gray-200">{channelName}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoCard;
