// import { useRef, useEffect, useState } from 'react';
import './App.css';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import useMap from './hooks/useMap';
import Header from './components/Header/Header';
import Footer from './components/Header/Footer/Footer';

const App = () => {
	const { map, mapElement } = useMap();

	//function for animating around center
	// const rotateCamera = (timestamp) => {
	//   const rotationDegree = (timestamp / 100) % 360;
	//   map.rotateTo(rotationDegree, { duration: 0 });
	//   requestAnimationFrame(rotateCamera);
	//   map.zoomTo(14);
	//   map.setPitch(60);
	// };

	return (
		<>
			<Header />
			{map && (
				<div className="map-wrapper">
					<div ref={mapElement} className="map" />
				</div>
			)}
			<Footer />
		</>
	);
};

export default App;
