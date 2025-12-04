import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatName, titleCase } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function renderNestedComments(
  comments: any,
  moreComments: any,
  isLoader: any,
  hideReplies: any
) {
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  if (!comments || comments.length === 0) return null;

  return comments.map((comment: any, index: number) => (
      <div key={index}>
        <div  className="flex gap-3 ml-8">
          <Avatar className="h-8 w-8 border border-gray-700">
            <AvatarImage
              src={comment?.userInfo?.avatar?.startsWith("https://") ? comment?.userInfo?.avatar : previewImgUrl+'user/'+comment?.userInfo?.avatar}
              alt={comment?.userInfo?.name || "Avatar image"}
            />
            <AvatarFallback>
              {formatName(comment?.userInfo?.name || "Default Image")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-muted rounded-lg p-3">
              <p className="font-semibold">
                { comment?.userInfo?.name ? titleCase(comment?.userInfo?.name?.trim()) : "N/A" }
              </p>
              <p style={{ wordBreak: "break-word" }} className="text-sm">{comment?.comment}</p>
            </div>
            <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
              <span>
                {comment?.totalLike ? comment?.totalLike : 0}{" "}
                {comment?.totalLike > 1 ? "likes" : "like"}
              </span>
              <span>
                {comment?.createdAt
                  ? `${formatDistanceToNow(new Date(comment?.createdAt))} ago`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {comment.children?.length > 0 && (
          <>
            {/* <Button
              className="mt-2"
              variant="link"
              onClick={() => hideReplies(comment.id)}
            >
              Hide Replies
            </Button> */}
            {renderNestedComments(
              comment.children,
              moreComments,
              isLoader,
              hideReplies
            )}
          </>
        )}
        {comment.totalComment > (comment.children?.length || 0) && (
          <span className="flex justify-end">
            <Button
              className="mt-2"
              variant="link"
              onClick={() => moreComments(comment.id, comment.offset || 0)}
            >
              View {comment.totalComment - (comment.children?.length || 0)} More
              Replies
            </Button>
          </span>
        )}
      </div>
  ));
}
