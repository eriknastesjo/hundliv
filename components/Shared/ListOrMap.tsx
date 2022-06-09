import { StyleSheet, Text, View, SafeAreaView, Button, TouchableOpacity, Image } from 'react-native';
import { Typography, Base, Buttons, Images } from '../../styles';

export default function ListOrMap({ navigation }) {

    function goToList() {
        navigation.navigate("Lista");
    }

    function goToMap() {
        navigation.navigate("Karta");
    }

    return (
        <View style={Base.centerContainer}>

            <Text style={Typography.boldCenter2}>
                Välj vy
            </Text>

            <View style={Base.rowContainer}>
                <View style={Buttons.buttonContainer}>
                    <TouchableOpacity onPress={goToList} style={Buttons.button}>
                        <Image source={require("../../assets/lista.png")} style={Images.buttonImageSmall} />
                        <Text style={Typography.boldCenterButton}>Lista</Text>
                    </TouchableOpacity>
                </View>

                <View style={Buttons.buttonContainer}>
                    <TouchableOpacity onPress={goToMap} style={Buttons.button}>
                        <Image source={require("../../assets/karta.png")} style={Images.buttonImageSmall} />
                        <Text style={Typography.boldCenterButton}>Karta</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
};