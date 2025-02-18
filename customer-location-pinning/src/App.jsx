import { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent.jsx';
import CustomerForm from './components/CustomerForm.jsx';
import apiService from './apiService';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const [selectedLatitude, setSelectedLatitude] = useState('');
    const [selectedLongitude, setSelectedLongitude] = useState('');
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [customersPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null); // Get token from local storage
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'


    const origin = {
        lat: 9.2408,   // Kubwa, Abuja Latitude
        lng: 7.3964,   // Kubwa, Abuja Longitude
    };

    const handleMarkerClick = (lat, lng) => {
        setSelectedLatitude(lat);
        setSelectedLongitude(lng);
    };

    const handleCustomerAdd = (customerData) => {
        fetchCustomers();
        setTotalCustomers(totalCustomers + 1);
        setSelectedLatitude('');
        setSelectedLongitude('');
    };

    const handleUpdateCustomer = (customerData) => {
        setIsLoading(true);
        apiService.updateCustomer(selectedCustomer._id, customerData, token)
            .then(() => {
                fetchCustomers();
                setSelectedCustomer(null);
            })
            .catch(error => {
                console.error('Error updating customer:', error);
                // Handle error (e.g., display error message)
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleDeleteCustomer = (id) => {
        setIsLoading(true);
        apiService.deleteCustomer(id, token)
            .then(() => {
                fetchCustomers();
            })
            .catch(error => {
                console.error('Error deleting customer:', error);
                // Handle error (e.g., display error message)
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.getCustomers(currentPage, customersPerPage, token);
            let filteredCustomers = response.customers;

            if (searchTerm) {
                filteredCustomers = response.customers.filter(customer =>
                    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            setCustomers(filteredCustomers);
            setTotalCustomers(response.totalCount);
            setTotalPages(Math.ceil(response.totalCount / customersPerPage));
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCustomers();
        }
    }, [currentPage, customersPerPage, searchTerm, token]);

    useEffect(() => {
        const fetchCustomerCount = async () => {
            setIsLoading(true);
            try {
                const response = await apiService.getCustomerCount(token);
                setTotalCustomers(response.count);
            } catch (error) {
                console.error('Error fetching customer count:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchCustomerCount();
        }
    }, [token]);

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setSelectedLatitude(String(customer.latitude));
        setSelectedLongitude(String(customer.longitude));
    };

    const handleLogin = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
        setAuthMode('loggedIn'); // Set authMode to loggedIn after successful login
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setAuthMode('login'); // Set authMode back to login after logout
    };

    const renderAuthForm = () => {
        switch (authMode) {
            case 'login':
                return (
                    <div className="flex flex-col items-center">
                        <Login onLogin={handleLogin} />
                        <button onClick={() => setAuthMode('register')} className="text-blue-500 hover:text-blue-700 mt-2">
                            New user? Register
                        </button>
                    </div>
                );
            case 'register':
                return (
                    <div className="flex flex-col items-center">
                        <Register />
                        <button onClick={() => setAuthMode('login')} className="text-blue-500 hover:text-blue-700 mt-2">
                            Already have an account? Login
                        </button>
                    </div>
                );
             case 'loggedIn':
                  return (
                        <>
                              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                    Logout
                              </button>
                              <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-3/4">
                                          <MapComponent apiKey={apiKey} onMarkerClick={handleMarkerClick} customers={customers} origin={origin} />
                                    </div>
                                    <div className="w-full md:w-1/4 p-4">
                                          <CustomerForm
                                                onCustomerAdd={handleCustomerAdd}
                                                selectedLatitude={selectedLatitude}
                                                selectedLongitude={selectedLongitude}
                                                selectedCustomer={selectedCustomer}
                                                onUpdateCustomer={handleUpdateCustomer}
                                                fetchCustomers={fetchCustomers}
                                          />
                                    </div>
                              </div>

                              <div className="flex flex-col items-center">
                                    <h2 className="text-green-500 font-bold text-center">Customer List</h2>
                                    <input
                                          type="text"
                                          placeholder="Search by name..."
                                          value={searchTerm}
                                          onChange={handleSearchChange}
                                          className="shadow appearance-none border rounded w-3/4 md:w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                                    />
                              </div>
                              <p className="text-center">Total Customers: {totalCustomers}</p>

                              {isLoading ? (
                                    <div className="text-center">Loading customers...</div>
                              ) : (
                                    <ul className="list-none p-0">
                                          {customers.map((customer) => (
                                                <li key={customer._id} className="mb-4 p-4 border rounded shadow-md customer-list-item">
                                                      <div className="font-bold">{customer.name}</div>
                                                      <p>Lat: {customer.latitude}, Lng: {customer.longitude}</p>
                                                      <div className="mt-2">
                                                            <button
                                                                  onClick={() => handleSelectCustomer(customer)}
                                                                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                                            >
                                                                  Update
                                                            </button>
                                                            <button
                                                                  onClick={() => handleDeleteCustomer(customer._id)}
                                                                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                            >
                                                                  Delete
                                                            </button>
                                                      </div>
                                                </li>
                                          ))}
                                    </ul>
                              )}

                              <div className="flex justify-center">
                                    <button
                                          onClick={handlePreviousPage}
                                          disabled={currentPage === 1 || isLoading}
                                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mr-2"
                                    >
                                          Previous
                                    </button>
                                    <button
                                          onClick={handleNextPage}
                                          disabled={currentPage === totalPages || isLoading}
                                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                                    >
                                          Next
                                    </button>
                              </div>
                        </>
                  )
            default:
                return null;
        }
    };

    if (!apiKey) {
        return <div>Please provide a Google Maps API key in .env file</div>;
    }

    return (
        <div className="App p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Customer Location Pinning</h1>
            {renderAuthForm()}
        </div>
    );
};

export default App;