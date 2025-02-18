import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import apiService from '../apiService';


const CustomerForm = ({ onCustomerAdd, selectedLatitude, selectedLongitude, selectedCustomer, onUpdateCustomer, fetchCustomers }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [latitude, setLatitude] = useState(selectedLatitude || '');
    const [longitude, setLongitude] = useState(selectedLongitude || '');
    const [showPopup, setShowPopup] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (selectedCustomer) {
            setName(selectedCustomer.name);
            setAddress(selectedCustomer.address);
            setContact(selectedCustomer.contact);
            setLatitude(String(selectedCustomer.latitude)); // Ensure latitude is a string
            setLongitude(String(selectedCustomer.longitude)); // Ensure longitude is a string
        } else {
            setName('');
            setAddress('');
            setContact('');
            setLatitude(selectedLatitude || '');
            setLongitude(selectedLongitude || '');
        }
    }, [selectedCustomer, selectedLatitude, selectedLongitude]);

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!name) {
            tempErrors.name = 'Name is required';
            isValid = false;
        }
        if (!address) {
            tempErrors.address = 'Address is required';
            isValid = false;
        }

        if (!contact) {
            tempErrors.contact = 'Contact is required';
            isValid = false;
        } else if (!/^[0-9]+$/.test(contact)) {
            tempErrors.contact = 'Contact must contain only numbers';
            isValid = false;
        } else if (contact.length > 11) {
            tempErrors.contact = 'Contact cannot be more than 11 digits';
            isValid = false;
        }

        if (!latitude) {
            tempErrors.latitude = 'Latitude is required';
            isValid = false;
        } else if (isNaN(latitude)) {
            tempErrors.latitude = 'Latitude must be a number';
            isValid = false;
        } else if (latitude < -90 || latitude > 90) {
            tempErrors.latitude = 'Latitude must be between -90 and 90';
            isValid = false;
        }

        if (!longitude) {
            tempErrors.longitude = 'Longitude is required';
            isValid = false;
        } else if (isNaN(longitude)) {
            tempErrors.longitude = 'Longitude must be a number';
            isValid = false;
        } else if (longitude < -180 || longitude > 180) {
            tempErrors.longitude = 'Longitude must be between -180 and 180';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const clearForm = () => {
        setName('');
        setAddress('');
        setContact('');
        setLatitude('');
        setLongitude('');
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const customerData = {
            name,
            address,
            contact,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        };

        try {
            if (selectedCustomer) {
                // Update existing customer
                await onUpdateCustomer(customerData);
            } else {
                // Create new customer
                const response = await apiService.createCustomer(customerData);
                console.log('Customer created:', response.data);
                onCustomerAdd(response.data);
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                }, 3000);
            }
            clearForm(); // Clear form after successful submission
            fetchCustomers(); // Refresh customer list after submission
        } catch (error) {
            console.error('Error creating/updating customer:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 relative">
            <div className="mb-2">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input type="text" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
            </div>
            <div className="mb-2">
                <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
                <input type="text" id="address" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={address} onChange={(e) => setAddress(e.target.value)} />
                {errors.address && <p className="text-red-500 text-xs italic">{errors.address}</p>}
            </div>
            <div className="mb-2">
                <label htmlFor="contact" className="block text-gray-700 text-sm font-bold mb-2">Contact:</label>
                <input type="text" id="contact" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={contact} onChange={(e) => setContact(e.target.value)} />
                {errors.contact && <p className="text-red-500 text-xs italic">{errors.contact}</p>}
            </div>
            <div className="mb-2">
                <label htmlFor="latitude" className="block text-gray-700 text-sm font-bold mb-2">Latitude:</label>
                <input
                    type="text" id="latitude" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                {errors.latitude && <p className="text-red-500 text-xs italic">{errors.latitude}</p>}
            </div>
            <div className="mb-2">
                <label htmlFor="longitude" className="block text-gray-700 text-sm font-bold mb-2">Longitude:</label>
                <input
                    type="text" id="longitude" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                {errors.longitude && <p className="text-red-500 text-xs italic">{errors.longitude}</p>}
            </div>

            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                {selectedCustomer ? 'Update Customer' : 'Add Customer'}
            </button>

            {showPopup && (
                <div
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '5px',
                            textAlign: 'center',
                        }}
                    >
                        Customer addition successful!
                    </div>
                </div>
            )}
        </form>
    );
};

CustomerForm.propTypes = {
  onCustomerAdd: PropTypes.func.isRequired,
  selectedLatitude: PropTypes.number,
  selectedLongitude: PropTypes.number,
  selectedCustomer: PropTypes.object,
  onUpdateCustomer: PropTypes.func
};

export default CustomerForm;