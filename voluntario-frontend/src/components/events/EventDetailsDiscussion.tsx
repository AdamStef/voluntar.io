import { useState, useEffect } from 'react';
import { Panel } from '../ui/Panel';
import { getEventPosts } from "@/utils/api/api.ts"
import type { EventPostType, /*UserType*/ } from "@/utils/types/types.ts";
import { useParams } from "react-router-dom";
// import { getUser } from "@/utils/api/api.ts";

type EventDetailsDiscussionProps = {
  eventId: string;
};

export const EventDetailsDiscussion = () => {
  const { eventId } = useParams() as EventDetailsDiscussionProps; // Pobierz eventId z parametrów adresu URL
  const [posts, setPosts] = useState<EventPostType[]>([]); // Użyj pustej tablicy jako początkowej wartości dla stanu posts

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getEventPosts(eventId); // Pobierz dane postów
        // Przekształć posty, dodając do nich znacznik czasu utworzenia
        const updatedPosts = Array.isArray(response.data) ? response.data.map(post => ({...post, createdAtTimestamp: new Date(post.createdAt).getTime()})) : [{...response.data, createdAtTimestamp: new Date(response.data.createdAt).getTime()}];
        // Sortuj posty na podstawie znacznika czasu utworzenia w kolejności malejącej
        const sortedPosts = updatedPosts.sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching event posts:', error);
      }
    };
    fetchPosts();
  }, [eventId]);

  return (
    <div>
      {/*<h2>Discussion</h2>*/}
      {posts.map(post => (
        <div key={post.id} style={{ marginBottom: '20px' }}>
          <Panel>
            <p style={{ fontWeight: "bold" }}>
              <span style={{ display: "inline-block", verticalAlign: "middle",  marginTop: "-20px", marginRight: "-5px", marginLeft: "-15px", marginBottom:"-10px" }}>
                <span style={{
                  color: "white",
                  // backgroundColor: "black",
                  borderRadius: "50%",
                  padding: "2px 5px",
                  fontSize: "60px",
                  lineHeight: "1",
                  // height: "60px"
                }}>●</span>
              </span>
              {"organizator o id: " + post.organizerId}
            </p> {/*TODO: zamienić jakoś, żeby odczcytywało nazwę oragnizacji a nie id, plus to białe kółko na avatar jakiś*/}
            <p style={{ fontSize: "10px" }}>{post.createdAt.toLocaleString()}{post.wasEdited ? " (edytowany)" : ""}</p>
            <p>{post.content}</p>
          </Panel>
        </div>
      ))}
    </div>
  );
};