import { EventDetailsDiscussion } from "@/components/events/EventDetailsDiscussion.tsx";
export const EventDiscussionPage = () => {
  // Odczytaj eventId z adresu URL za pomocą useParams
  // const { eventId } = useParams();

  return (
    <div className="container mt-4 lg:w-4/5">
      <EventDetailsDiscussion />
    </div>
  );
}
