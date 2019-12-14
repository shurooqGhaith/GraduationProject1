import React from "react";
import {StyleSheet, View, TouchableHighlight, TextInput, Modal} from "react-native";
import {Icon} from 'react-native-elements'
import {Text} from "galio-framework";
import {argonTheme} from "../constants";
import fire from "../constants/firebaseConfigrations";

class AddQuestions extends React.Component {
    constructor(props) {
        super(props);
        this.questioner = this.props.questioner;

        this.state = {
            summary: '',
            details: '',
            showModal: false
        };
    }

    addQuestion() {
        fire.database().ref().child('questions').push({
            questionerId: this.questioner.key,
            questioner: this.questioner.val().name,
            summary: this.state.summary,
            details: this.state.details,
           
        });
        this.closeModal();
    }

    openModal = () => {
        this.setState({
            showModal: true
        });
    };

    closeModal = () => {
        this.setState({
            showModal: false
        });
    };

    render() {
        return (
            <View>
                <View style={styles.circleContent}>
                    <TouchableHighlight
                        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                        onPress={this.openModal}
                    >
                        <Text style={{fontSize: 28, color: 'white',alignItems:'center'}}>ASK</Text>
                    </TouchableHighlight>
                </View>
                <Modal
                    style={{flex: 1, marginTop: 22}}
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showModal}
                >
                    <TouchableHighlight
                        style={{alignSelf: 'flex-end'}}
                        onPress={() => {
                            this.closeModal();
                        }}>
                        <Icon
                            name='close'
                            type='material'
                            color='#517fa4'
                            size={28}/>
                    </TouchableHighlight>
                    <View id="add-question" style={styles.modalContent}>
                        <Text h5={true} color={'#3F4545'}> Ask A Dentist .</Text>
                        <TextInput
                            placeholder="The outline of your problem."
                            multiline={false}
                            style={styles.questionTextArea}
                            onChangeText={questionText =>
                                this.setState({
                                    summary: questionText
                                })
                            }
                        />
                        <TextInput
                            placeholder="Talk in details."
                            multiline={true}
                            style={[styles.questionTextArea, {minHeight: 150,}]}
                            onChangeText={questionText =>
                                this.setState({
                                    details: questionText
                                })
                            }
                        />
                        <TouchableHighlight
                            style={{
                                marginTop: 10, padding: 10, borderWidth: 1,
                                borderColor: "#316BE8", backgroundColor: '#3575FF'
                            }}
                            onPress={() => this.addQuestion()}
                            textStyle={{color: argonTheme.COLORS.BLACK}}
                        >
                            <Text size={20} color={'#FFFFFF'}>Add Question</Text>
                        </TouchableHighlight>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    questionTextArea: {
        width: "96%",
        minHeight: 50,
        backgroundColor: "white",
        padding: 10,
        marginTop: 5,
        borderWidth: 1,
        borderColor: "#E9ECEF"
    },
    modalStyle: {
        flex: 1
    },
    modalContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center"
    },
    questionModalText: {
        marginTop: 50,
        marginBottom: 8,
        fontSize: 18,
        color: "white",
    },
    userModalContent: {
        position: "relative",
        height: "100%"
    },
    circleContent: {
      //position: "absolute",
        flex: 0.1,
        //flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 70,
      // right: 30,
       //left:20,
        minWidth: 50,
       minHeight: 50,
        borderRadius: 300,
        backgroundColor: '#3575FF'
    }
});
export default AddQuestions;
