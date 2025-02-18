import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';;
import PropTypes from 'prop-types';
import { getDistance } from 'geolib';

const containerStyle = {
    width: '100%',
    height: '600px',
};

const center = {
    lat: 40.7128,
    lng: -74.0060,
};

const MapComponent = ({ apiKey, onMarkerClick, customers, origin }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
    });

    const [newMarker, setNewMarker] = useState(null); // Only one new marker at a time
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const onMapClick = useCallback((event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setNewMarker({ lat, lng }); // Set new marker, replacing the old one
        onMarkerClick(lat, lng);

    }, [onMarkerClick]);

    const handleCustomerMarkerClick = (customer) => {
        setSelectedCustomer(customer);
    };

    const handleCloseTooltip = () => {
        setSelectedCustomer(null);
    };

    const calculateDistance = (customer) => {
        try {
            const distance = getDistance(
                { latitude: origin.lat, longitude: origin.lng },
                { latitude: customer.latitude, longitude: customer.longitude }
            );
            // Convert meters to kilometers and format to 2 decimal places
            return (distance / 1000).toFixed(2);
        } catch (error) {
            console.error("Error calculating distance:", error);
            return "N/A"; // Handle potential errors (e.g., invalid coordinates)
        }
    };

    const renderMap = () => {
        if (loadError) {
            return <div>Error loading Maps</div>;
        }

        if (!isLoaded) {
            return <div>Loading Maps</div>;
        }

        return (
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onClick={onMapClick}
            >
                {newMarker && (
                    <Marker
                        position={{ lat: newMarker.lat, lng: newMarker.lng }}
                    />
                )}
                {customers.map((customer) => (
                    <Marker
                        key={customer._id}
                        position={{ lat: customer.latitude, lng: customer.longitude }}
                        onClick={() => handleCustomerMarkerClick(customer)}
                    />
                ))}
                {selectedCustomer && (
                    <div
                        style={{
                            position: 'absolute',
                            background: 'white',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            top: '10px',
                            left: '10px',
                            zIndex: 10,
                        }}
                    >
                        <button
                            style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                            onClick={handleCloseTooltip}
                        >
                            X
                        </button>
                        <strong>{selectedCustomer.name}</strong>
                        <p>Address: {selectedCustomer.address}</p>
                        <p>Contact: {selectedCustomer.contact}</p>
                        <p>Distance: {calculateDistance(selectedCustomer)} km</p> {/* Display the distance */}
                    </div>
                )}
            </GoogleMap>
        );
    };

    return (
        <>
            {renderMap()}
        </>
    );
};

MapComponent.propTypes = {
  apiKey: PropTypes.string.isRequired,
  onMarkerClick: PropTypes.func.isRequired,
  customers: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    contact: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  })).isRequired,
  origin: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
};

export default MapComponent;
