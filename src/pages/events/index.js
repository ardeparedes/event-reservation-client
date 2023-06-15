import { useEffect, useState } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/Layouts/AppLayout';
import axios from '@/lib/axios';
import { useAuth } from '@/hooks/auth';

const Events = () => {
    const { user } = useAuth({ middleware: 'guest' });

    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchEvents();
    }, [currentPage]);

    const handleReserveTicket = async (eventId) => {
        // Handle reserve ticket action
        console.log(`Reserve ticket for event with ID: ${eventId}`);

        try {
            const response = await axios.post(`/api/events/${eventId}/reserve`);
            alert(response?.data?.message);
            fetchEvents();
        } catch (error) {
            alert(error?.response?.data?.message);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`/api/events?page=${currentPage}`);

            let last_page = response.data.last_page
            if (last_page < totalPages && currentPage == totalPages) {
                setCurrentPage(last_page)
            }

            setEvents(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const formattedDateTime = (datetime) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        };

        return new Date(datetime).toLocaleString('en-US', options);
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Events
                </h2>
            }
        >
            <Head>
                <title>Laravel - Events</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="border-collapse table-auto w-full text-sm">
                                    <thead className="bg-white text-left">
                                        <tr>
                                            <th className="font-medium p-4 pl-8 pt-0 pb-3">Title</th>
                                            <th className="font-medium p-4 pt-0 pb-3">Description</th>
                                            <th className="font-medium p-4 pt-0 pb-3">Date</th>
                                            <th className="font-medium p-4 pt-0 pb-3">Deadline</th>
                                            <th className="font-medium p-4 pt-0 pb-3">Location</th>
                                            <th className="font-medium p-4 pt-0 pb-3">Price</th>
                                            <th className="font-medium p-4 pt-0 pb-3">Ticket</th>
                                            <th className="font-medium p-4 pr-8 pt-0 pb-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {events.map((event) => (
                                            <tr key={event.id}>
                                                <td className="p-4 pl-8">{event.title}</td>
                                                <td className="p-4">{event.description}</td>
                                                <td className="p-4">{formattedDateTime(event.datetime)}</td>
                                                <td className="p-4">{formattedDateTime(event.deadline)}</td>
                                                <td className="p-4">{event.location}</td>
                                                <td className="p-4 whitespace-nowrap">{event.price}</td>
                                                <td className="p-4 whitespace-nowrap">{event.attendee_limit - event.reservations.length}</td>
                                                <td className="p-4 pr-8 whitespace-nowrap">
                                                    {event.reservations.find(({ id }) => id === user?.id) === undefined ? (
                                                        <button
                                                            className="px-3 py-2 mx-1 text-xs rounded-md bg-lime-500 text-white"
                                                            onClick={() => handleReserveTicket(event.id)}
                                                        >
                                                            Reserve Ticket
                                                        </button>
                                                    ) : (
                                                        <button className="px-3 py-2 mx-1 text-xs rounded-md bg-gray-500 text-white" disabled>
                                                            Ticket Reserved
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`px-3 py-2 mx-1 rounded-md ${currentPage === page ? 'bg-stone-700 text-white' : 'bg-gray-200'}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
};

export default Events;
