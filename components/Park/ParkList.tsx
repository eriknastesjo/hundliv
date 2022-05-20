import { StyleSheet, Text, View, SafeAreaView, Button, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import parkModel from '../../models/park';
import { Typography, Base } from '../../styles';


export default function ParkList() {

    const [parks, setParks] = useState([]);


    useEffect(() => {
        (async function () {
            setParks(await parkModel.getData());
        })();
    }, []);


    // listToSort behöver skapas för att bli av med ﻿
    // framför namn key så att det går att sortera!

    const listToSort: Array= [];

    for (let i = 0; i < parks.length; i++) {
        listToSort.push({
            "beskrivning": parks[i]["beskrivning"],
            "nord-koordinat (wgs84)": parks[i]["nord-koordinat (wgs84)"],
            "ost-koordinat (wgs84)": parks[i]["ost-koordinat (wgs84)"],
            "webbsida": parks[i]["webbsida"],
            "namn": parks[i]["﻿namn"],

        });
    }

    if (listToSort) {
        listToSort.sort((a, b) => {
            let fa = a.namn.toLowerCase(),
                fb = b.namn.toLowerCase();

            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }

            return 0;
        });
    }

    const listOfParks = listToSort
        .map((listToSort, index) => {
            return <Button
                color='#313131'
                title={listToSort["namn"]}
                key={index}
                // onPress={() => {
                //     navigation.navigate('Details', {
                //         park: park
                //     });
                // }}
            />
        });

    return (
        <ScrollView>
            <Text style={Typography.boldCenter}>Parker</Text>
            {listOfParks}
        </ScrollView>
    );
};