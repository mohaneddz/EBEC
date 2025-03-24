import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


// Syntax for future Imports : ------------

    // const [Events, setEvents] = useState(null);
    // const [fetchError, setFetchError] = useState(null);


    // useEffect(() => {
    //     const fetchEvent = async () => {
    //         const { data, error } = await supabase.from('Event').select('*');

    //         if (error) {
    //             setFetchError('Could not fetch the Events!');
    //             setEvents(null);
    //             console.log('Fetch error:', error);
    //         }
    //         if (data) {
    //             const events = data
    //                 .map(({ id, title, src, description, content, event_date }) => ({
    //                     id,
    //                     title,
    //                     src,
    //                     description,
    //                     content,
    //                     ctaText: "Join Us",
    //                     ctaLink: "login",
    //                     event_date,
    //                 }))
    //                 .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    //             setEvents(events);
    //             setFetchError(null);
    //         }
    //     };
    //     fetchEvent();
    // }, []);

    // {Events && (
    //     < ExpandableCardDemo cards={Events} />
    // )}

