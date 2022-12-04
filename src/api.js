import axios from 'axios';

export const fetchPlaces = async () => {
	const result = await axios.get('http://localhost:3000');

	return result;
};
