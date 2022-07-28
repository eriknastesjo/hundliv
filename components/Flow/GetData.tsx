import { useState, useEffect } from 'react';
import sodertaljeModel from '../../models/sodertalje';


// * Kallas från FlowStack.tsx
// Hämtar data från model och "förfinar" den baserat på om API är baserat på Json eller GeoJson.
// Tittar också på om kompletterande information ska hämtas (t.ex. startpunkter som ska visas i MapAll men inte i List).
// ==========================================
export default function GetData(props) {
    const { urlEndJson, urlEndGeo, urlEndCompl } = props;
    const [data, setData] = useState([]);
    const [dataComl, setdataComl] = useState([]);

    let fitCoordinates: any;

    useEffect(() => {

        if (urlEndJson) {
            (async function () {
                setData(await sodertaljeModel.getJsonData(urlEndJson));
            })();
        }

        if (urlEndGeo) {
            (async function () {
                const result = await sodertaljeModel.getGeoJsonData(urlEndGeo)
                setData(result);
            })();
        }

        if (urlEndCompl) {
            (async function () {
                setdataComl(await sodertaljeModel.getJsonData(urlEndCompl));
            })();
        }

    }, []);


    let refinedData: Array<any> = [];

    if (urlEndJson && data) {
        refinedData = data
            .map((dataItem) => {
                return {
                    "beskrivning": dataItem["beskrivning"]
                        ?? dataItem["information"]
                        ?? dataItem["informatiom"]
                        ?? dataItem["description"]
                        ?? dataItem["vägbeskrivning"],

                    "latitude": dataItem["nord-koordinat (wgs84)"]
                        ?? dataItem["latitude"],

                    "longitude": dataItem["ost-koordinat (wgs84)"]
                        ?? dataItem["longitude"],

                    "webbsida": dataItem["webbsida"]
                        ?? dataItem["visit_url"],

                    "namn": dataItem["﻿namn"]
                        ?? dataItem["name"]
                }
            });
    }

    if (urlEndGeo && data) {
        fitCoordinates = calculateFitCoordinatesGeoJson(data);
        refinedData = data
            .map((dataItem) => {
                return {

                    "geoJson": dataItem,

                    "namn": dataItem.features[0].properties.Namn,

                    "längd": dataItem.features[0].properties["Längd"],

                    "underlag": dataItem.features[0].properties["Underlag"],

                    "svårighetsgrad": dataItem.features[0].properties["Svårighetsgrad"],

                    "belysning": dataItem.features[0].properties["Belysning"]
                }
            });
    }

    let refinedDataCompl: Array<any> = [];

    if (urlEndCompl && data) {
        refinedDataCompl = dataComl
            .map((dataItem) => {
                return {
                    "beskrivning": dataItem["beskrivning"]
                        ?? dataItem["information"]
                        ?? dataItem["informatiom"]
                        ?? dataItem["vägbeskrivning"],

                    "latitude": dataItem["nord-koordinat (wgs84)"],
                    "longitude": dataItem["ost-koordinat (wgs84)"],
                    "webbsida": dataItem["webbsida"],
                    "namn": dataItem["﻿namn"]
                }
            });
    }

    // Om t.ex. något går fel vid hämtning av data, t.ex. pga dålig internetuppkoppling så skickas detta istället.
    // ============================================
    if (!data) {
        return "data not found";
    }

    return {
        "refinedData": refinedData,
        "refinedDataCompl": refinedDataCompl,
        "fitCoordinates": fitCoordinates
    }


    function calculateFitCoordinatesGeoJson(geoJsonHolder: any) {

        if (geoJsonHolder.length != 0) {
            let allCoordinates: Array<Array<number>> = [];

            const geoJsonHolderLength = geoJsonHolder.length;

            for (let i = 0; i < geoJsonHolderLength; i++) {

                const geoJsonLength = geoJsonHolder[i].features.length;
                for (let j = 0; j < geoJsonLength; j++) {
                    allCoordinates.push(...geoJsonHolder[i].features[j].geometry.coordinates);
                }
            }

            const lowestLat = allCoordinates.reduce((a, b) => a[1] < b[1] ? a : b)[1];
            const highestLat = allCoordinates.reduce((a, b) => a[1] > b[1] ? a : b)[1];

            const lowestLng = allCoordinates.reduce((a, b) => a[0] < b[0] ? a : b)[0];
            const highestLng = allCoordinates.reduce((a, b) => a[0] > b[0] ? a : b)[0];

            return [{ latitude: lowestLat, longitude: lowestLng }, { latitude: highestLat, longitude: highestLng }]

        }

    }
}