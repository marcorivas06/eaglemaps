import { useEffect, useRef, useState, useCallback } from 'react';
import * as tt from '@tomtom-international/web-sdk-maps';
import * as ttapi from '@tomtom-international/web-sdk-services';
import { fetchPlaces } from '../api';

const useMap = () => {
	const mapElement = useRef();
	const [map, setMap] = useState({});
	const [longitude, setLongitude] = useState(0);
	const [latitude, setLatitude] = useState(0);
	const [places, setPlaces] = useState([]);

	useEffect(() => {
		// navigator.geolocation.getCurrentPosition(
		// 	({ coords: { latitude, longitude } }) => {
		// 		setLongitude(longitude);
		// 		setLatitude(latitude);
		// 	},
		// 	async (error) => {
		// 		console.log(error);
		// 	}
		// );

		setLongitude(-84.323242);
		setLatitude(33.797028);
	}, []);

	useEffect(() => {
		const data = fetchPlaces();
		console.log(data);
	}, [places]);

	const convertToPoints = (lngLat) => {
		return {
			point: {
				latitude: lngLat.lat,
				longitude: lngLat.lng,
			},
		};
	};

	const drawRoute = (geoJson, map) => {
		if (map.getLayer('route')) {
			map.removeLayer('route');
			map.removeSource('route');
		}
		map.addLayer({
			id: 'route',
			type: 'line',
			source: {
				type: 'geojson',
				data: geoJson,
			},
			paint: {
				'line-color': '#4a90e2',
				'line-width': 6,
			},
		});
	};

	const addDeliveryMarker = (lngLat, map) => {
		const element = document.createElement('div');
		element.className = 'marker-delivery';
		new tt.Marker({
			element: element,
		})
			.setLngLat(lngLat)
			.addTo(map);
	};
	const createMarker = (position) => {
		const markerElement = document.createElement('div');
		markerElement.className = 'marker';
		const color = '#5327c3';
		const popupText = 'popupText';

		const markerContentElement = document.createElement('div');
		markerContentElement.className = 'marker-content';
		markerContentElement.style.backgroundColor = color;
		markerElement.appendChild(markerContentElement);

		const iconElement = document.createElement('div');
		iconElement.className = 'marker-icon';
		const url =
			'(https://www.google.com/url?sa=i&url=https%3A%2F%2Fbranditechture.agency%2Fbrand-logos%2Fdownload%2Femory-eagles%2F&psig=AOvVaw3UODvi9nt6vyr4gv0MzPfV&ust=1670260195290000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCLCu9p664PsCFQAAAAAdAAAAABAF)';
		iconElement.style.backgroundImage = url;
		markerContentElement.appendChild(iconElement);

		const popup = new tt.Popup({ offset: 30 }).setText(popupText); // add marker to map
		new tt.Marker({ element: markerElement, anchor: 'bottom' })
			.setLngLat(position)
			.setPopup(popup)
			.addTo(map);
	};

	const populate = () => {
		places?.forEach((element) => {
			const lat = element.coords.lat;
			const lng = element.coords.lng;
			const position = [lng, lat];
			createMarker(position);
			console.log({ element }, 'Populate');
		});
	};

	useEffect(() => {
		const origin = {
			lng: longitude,
			lat: latitude,
		};
		const destinations = [];

		let map = tt.map({
			key: 'uTdoPSdhmuaBU6Bnm591pc7oOpD0hCAK',
			container: mapElement.current,
			stylesVisibility: {
				trafficIncidents: true,
				trafficFlow: true,
			},
			center: [longitude, latitude],
			zoom: 14,
		});
		map.addControl(new tt.FullscreenControl());
		map.addControl(new tt.NavigationControl());
		setMap(map);

		const addMarker = () => {
			const popupOffset = {
				bottom: [0, -25],
			};
			const popup = new tt.Popup({ offset: popupOffset }).setHTML(
				'This is you!'
			);
			const element = document.createElement('div');
			element.className = 'marker';

			const marker = new tt.Marker({
				draggable: true,
				element: element,
			})
				.setLngLat([longitude, latitude])
				.addTo(map);

			marker.on('dragend', () => {
				const lngLat = marker.getLngLat();
				setLongitude(lngLat.lng);
				setLatitude(lngLat.lat);
			});

			marker.setPopup(popup).togglePopup();
		};
		addMarker();

		const sortDestinations = (locations) => {
			const pointsForDestinations = locations.map((destination) => {
				return convertToPoints(destination);
			});
			const callParameters = {
				key: 'uTdoPSdhmuaBU6Bnm591pc7oOpD0hCAK',
				destinations: pointsForDestinations,
				origins: [convertToPoints(origin)],
				travelMode: 'pedestrian',
			};

			return new Promise((resolve, reject) => {
				ttapi.services
					.matrixRouting(callParameters)
					.then((matrixAPIResults) => {
						const results = matrixAPIResults.matrix[0];
						console.log(matrixAPIResults.matrix);
						const resultsArray = results.map((result, index) => {
							return {
								location: locations[index],
								drivingtime:
									result.response.routeSummary
										.travelTimeInSeconds,
							};
						});
						resultsArray.sort((a, b) => {
							return a.drivingtime - b.drivingtime;
						});
						const sortedLocations = resultsArray.map((result) => {
							return result.location;
						});
						resolve(sortedLocations);
					});
			});
		};

		const recalculateRoutes = () => {
			sortDestinations(destinations).then((sorted) => {
				sorted.unshift(origin);

				ttapi.services
					.calculateRoute({
						key: 'uTdoPSdhmuaBU6Bnm591pc7oOpD0hCAK',
						locations: sorted,
						travelMode: 'pedestrian',
					})
					.then((routeData) => {
						const geoJson = routeData.toGeoJson();
						drawRoute(geoJson, map);
					});
			});
		};

		map.on('click', (e) => {
			destinations.push(e.lngLat);
			addDeliveryMarker(e.lngLat, map);
			recalculateRoutes();
			// rotateCamera(3);
		});

		return () => map.remove();
	}, [longitude, latitude]);

	return {
		map,
		mapElement,
		setLongitude,
		setLatitude,
		populate,
	};
};
export default useMap;
