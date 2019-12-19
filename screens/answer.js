import React from "react";
import { StyleSheet, View, ScrollView, TouchableHighlight, TextInput } from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";
import { Block, Text } from "galio-framework";
import { argonTheme } from "../constants";
import AddQuestions from "../components/add-question";
import Moment from 'moment';
import fire from "../constants/firebaseConfigrations";
import _ from "lodash";


export default class answer extends React.Component {
    constructor(props) {
        super(props);

        const { navigation } = this.props;
        /* user it's a Firebase data snapshot */
        this.user = navigation.getParam('user');
        this.userInfo = this.user.val();

        this.state = {

            answerQQ: "",
            summary: "",
            details: "",
            questions: [],
            answer: "",
            selectedQuestionId: 0,
            showModal: false,
            originalQuestions: []

        }


    }


    componentDidMount() {
        fire.database().ref("questions").on('value', (datasnapshot) => {
            if (datasnapshot.val()) {
                let items = datasnapshot;
                let questionsData = [];

                datasnapshot.forEach(question => {
                    questionsData.push(question);
                });
                questionsData = questionsData.reverse();

                this.setState({
                    summary: items.val().summary,
                    details: items.val().details,
                    originalQuestions: questionsData,
                    questions: questionsData
                });
            }
        });
    }


    closeModal() {
        this.setState({
            showModal: false
        });
    }



    openModal(selectedId) {
        this.setState({
            selectedQuestionId: selectedId,
            showModal: true
        });
    }

    saveAnswer(text) {
        // save answer of selected question to firebase.
        const selectedQuestion = _.find(this.state.questions, { key: this.state.selectedQuestionId });

        selectedQuestion.ref.child('answers').push({
            response: text,
            doctorId: this.user.key,
            doctor: this.userInfo.name
        })
        this.closeModal();
    }


    render() {
        return (


            <Block flex style={{ position: "relative", backgroundColor: "#eee" }}>
                <View
                    center
                    style={{
                        marginTop: 30,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Text h5={true}>Our Community</Text>
                    <Text muted={true}>({this.state.questions.length} Questions)</Text>

                </View>

                <ScrollView showsVerticalScrollIndicator={true} style={{ flex: 1 }}>
                    <View style={styles.itemsList}>
                        <View>
                            {this.state.questions &&
                                this.state.questions.map((item) => {
                                    return (

                                        <TouchableHighlight
                                            key={`question_${item.key}`}
                                            style={styles.questionContainer}
                                            onPress={() => {
                                                this.openModal(`${item.key}`);
                                            }}
                                        >
                                            <View
                                                key={`question_${item.key}`}
                                                style={{ flex: 1, padding: 10, margin: 0 }}
                                            >
                                                <View style={{ flex: 1 }}>
                                                    <Text h5={true}>{item.val().summary}</Text>
                                                    <Text  fontSize='18'>{item.val().details}</Text>

                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                                    <View style={{ flex: 1, flexDirection: 'column' }}>


                                                    </View>
                                                    <View
                                                        style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                                        <Text color={'#E24739'}>By: {item.val().questioner}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                    );
                                })}
                        </View>
                    </View>
                    <View>
                        <Modal
                            isVisible={this.state.showModal}
                            style={styles.modalStyle}
                            backdropOpacity={0.8}
                        >



                            <View id="doctorContainer" style={styles.modalContent}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styles.questionModalText}>
                                    {this.state.summary}
                                </Text>
                                <Text style={styles.questionModalText}>
                                    {this.state.details}
                                </Text>

                                <TextInput
                                    placeholder="Type here to answer the question!"
                                    multiline={true}
                                    style={styles.answerTextArea}
                                    onChangeText={answer => (this.setState({ answerQQ: answer }))}
                                />
                                <Block center>
                                    <Button
                                        style={styles.saveButton}
                                        color={argonTheme.COLORS.SECONDARY}
                                        onPress={() => this.saveAnswer(this.state.answerQQ)}
                                        title="Save"
                                        textStyle={{ color: argonTheme.COLORS.BLACK }}
                                    />
                                    <Button
                                        style={{marginTop:20,backgroundColor:argonTheme.COLORS.ERROR}}
                                        color={argonTheme.COLORS.LABEL}
                                        onPress={() => this.closeModal()}
                                        title="Dismiss"
                                        textStyle={{ color: argonTheme.COLORS.BLACK }}
                                    />
                                </Block>
                                </ScrollView>
                            </View>







                        </Modal>
                    </View>
                </ScrollView>
            </Block>

        );
    }
};

const styles = StyleSheet.create({
    itemsList: {
        width: "100%"
    },
    questionContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "silver",
        borderRadius: 10,
        margin: 10,
        padding: 0
    },
    answerTextArea: {
        width: "100%",
        marginBottom: 8,
        minHeight: 60,
        backgroundColor: "white",
        padding: 10
    },
    modalStyle: {
        flex: 1
    },
    modalContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    questionModalText: {
        marginTop: 50,
        marginBottom: 8,
        fontSize: 18,
        color: "white"
    },
    saveButton: {
        marginBottom: 5
    },
    userModalContent: {
        position: "relative",
        height: "100%"
    },
    exitButton: {
        position: "absolute",
        top: 10,
        right: 0,
        backgroundColor: "transparent",
        fontSize: 18
    },
    answerContainer: {
        width: "100%",
        backgroundColor: "white",
        marginTop: 10,
        marginBottom: 10,
        padding: 20,
        borderRadius: 10
    }


});