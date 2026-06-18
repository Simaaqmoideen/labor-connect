import { useState, useEffect, useCallback, useRef } from 'react';

const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use a ref to store options to prevent infinite rendering loops
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const onSuccess = (position) => {
    setLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
    setLoading(false);
    setError(null);
  };

  const onError = (err) => {
    setError(err.message);
    setLoading(false);
  };

  const refresh = useCallback(() => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError, optionsRef.current);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...location, error, loading, refresh };
};

export default useGeolocation;
