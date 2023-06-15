import { useRef, useEffect, useState } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/Layouts/AppLayout';
import axios from '@/lib/axios';

const UserEvents = () => {
    const modalRef = useRef(null);
    const showModalButtonRef = useRef(null)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        datetime: '',
        deadline: '',
        location: '',
        price: '',
        attendee_limit: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.keyCode === 27) {
                // ESC key
                setShowModal(false);
            }
        };

        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) && event.target !== showModalButtonRef.current) {
                setShowModal(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [currentPage]);

    const handleFormFieldChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleEventCreation = async () => {
        try {
            const response = await axios.post(`/api/events`, formData);
            alert(response?.data?.message);
            setShowModal(false);
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
            const response = await axios.get(`/api/user/events?page=${currentPage}`);

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
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        My Events
                    </h2>
                    <button
                        className="px-3 py-2 text-sm rounded-md bg-lime-500 text-white"
                        onClick={() => setShowModal(true)}
                        ref={showModalButtonRef}
                    >
                        Create Event
                    </button>
                </div>
            }
        >
            <Head>
                <title>Laravel - My Events</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {showModal && (
                                <div className="fixed inset-0 flex items-center justify-center z-50">
                                    <div className="fixed inset-0 bg-gray-900 opacity-75"></div>
                                    <div className="bg-white w-100 md:w-1/2 p-6 rounded-lg shadow-lg relative overflow-y-auto h-[38rem] md:h-[42rem]" ref={modalRef}>
                                        <h3 className="text-lg font-semibold mb-4">Create Event</h3>
                                        {/* Form Fields */}
                                        <div className="mb-4">
                                            <label htmlFor="title" className="block font-medium">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                className="w-full border-gray-300 rounded-md"
                                                value={formData.title}
                                                onChange={handleFormFieldChange}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="description" className="block font-medium">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                rows="4"
                                                className="w-full border-gray-300 rounded-md"
                                                value={formData.description}
                                                onChange={handleFormFieldChange}
                                            ></textarea>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="datetime" className="block font-medium">
                                                Date and Time
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="datetime"
                                                className="w-full border-gray-300 rounded-md"
                                                value={formData.datetime}
                                                onChange={handleFormFieldChange}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="deadline" className="block font-medium">
                                                Deadline
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="deadline"
                                                className="w-full border-gray-300 rounded-md"
                                                value={formData.deadline}
                                                onChange={handleFormFieldChange}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="location" className="block font-medium">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                className="w-full border-gray-300 rounded-md"
                                                value={formData.location}
                                                onChange={handleFormFieldChange}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="price" className="block font-medium">
                                                Price
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                name="price"
                                                className="w-full border-gray-300 rounded-md"
                                                value={formData.price}
                                                onChange={handleFormFieldChange}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="attendee_limit" className="block font-medium">
                                                Attendee Limit
                                            </label>
                                            <input
                                                type="number"
                                                name="attendee_limit"
                                                className="w-full border-gray-300 rounded-md"
                                                value={formData.attendee_limit}
                                                onChange={handleFormFieldChange}
                                            />
                                        </div>
                                        {/* Buttons */}
                                        <div className="flex justify-end mt-4">
                                            <button
                                                className="px-3 py-2 text-sm rounded-md bg-stone-700 text-white mr-2"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="px-3 py-2 text-sm rounded-md bg-lime-500 text-white"
                                                onClick={handleEventCreation}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                            <th className="font-medium p-4 pr-8 pt-0 pb-3">Attendee Limit</th>
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
                                                <td className="p-4 pr-8 whitespace-nowrap">{event.attendee_limit}</td>
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

export default UserEvents;
