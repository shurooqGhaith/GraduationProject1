import React from "react";
import { StyleSheet, View, ScrollView, TouchableHighlight, TextInput,TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";
import { Block, Text } from "galio-framework";
import { argonTheme } from "../constants";
import AddQuestions from "../components/add-question";
import Moment from 'moment';
import fire from "../constants/firebaseConfigrations";
import { Icon } from 'react-native-elements'
import _ from "lodash";

const QuestionDetailsForPatient = props => {
    const answers = props.question.val().answers;
    return (
        <View id="userContainer" style={styles.userModalContent}>
         <TouchableHighlight
                    style={{alignSelf:'flex-end'}}
                    onPress={() =>{props.closeModal()} }
                    >
                      <Icon
                          name='close'
                          type='material'
                          color='#517fa4'
                          size={28}/>

                  </TouchableHighlight>
             
            
            <View>

              <ScrollView showsVerticalScrollIndicator={false}>
                    {
                        answers && Object.entries(answers).map(([key, answer]) => {
                            console.log(answer);
                            return (
                                <Block
                                    key={`answer_${key}`}
                                    style={styles.answerContainer}
                                >
                                    <Text bold={true}>{answer.response}</Text>
                                    <Text italic={true} muted={true}>DR. {answer.doctor}</Text>
                                </Block>
                            );
                        })
                    }
                    {
                        (!answers || !Object.entries(answers).length) && (
                            <Block style={styles.answerContainer}>
                                <Text>No Answers yet</Text>
                            </Block>
                        )
                    }
                </ScrollView>
            </View>
        </View>
    );
};


class Questions extends React.Component {
    constructor(props) {
        super(props);

        const { navigation } = this.props;
        /* user it's a Firebase data snapshot */
        this.user = navigation.getParam('user');
        this.userInfo = this.user.val();

        this.state = {
            answerQQ: "",
            questions: [],
            answer: "",
            selectedQuestionId: 0,
            showModal: false,
            originalQuestions: []
        };
    }

    componentDidMount() {

        // Get All question from Database and save them in questions state.
        fire
            .database()
            .ref("questions")
            .orderByChild('updatedAt')
            .on("value", snapshot => {
                let questionsData = [];
                snapshot.forEach(question => {
                    questionsData.push(question);
                });

                questionsData = questionsData.reverse();
                this.setState({
                    originalQuestions: questionsData,
                    questions: questionsData
                });
        });
    }

    

 
        

    openModal(selectedId) {
        this.setState({
            selectedQuestionId: selectedId,
            showModal: true
        });
    }

    closeModal() {
        this.setState({
            showModal: false
        });
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
                                                style={{ flex: 1, padding: 10, margin: 0}}
                                            >
                                                <View style={{ flex: 1 ,justifyContent:"space-between" }}>
                                                    <Text h5={true}>{item.val().summary}</Text>
                                                    <Text  fontSize='18'>{item.val().details}</Text>

                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                                    
                                                    <View
                                                        style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                                        <Text color={'#E24739'}>patient Name: {item.val().questioner}</Text>
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
                            
                                <QuestionDetailsForPatient
                                    question={_.find(this.state.questions, {key: this.state.selectedQuestionId})}
                                    closeModal={() => {
                                        this.closeModal()
                                    }}
                                    
                                    />

                           
                        </Modal>
                    </View>
                </ScrollView>

                {/* Add new Question */}
                {this.userInfo.type === "patient" && (<AddQuestions questioner={this.user}/>)}
            </Block>
        );
    }
}

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
    /*answerTextArea: {
        width: "100%",
        marginBottom: 8,
        minHeight: 60,
        backgroundColor: "white",
        padding: 10
    },*/
    modalStyle: {
        flex: 1,
        //alignContent:"center"

    
    },
    modalContent: {
        flex: 1,
        
        
    },
    /*questionModalText: {
        marginTop: 50,
        marginBottom: 8,
        fontSize: 18,
        color: "white"
    },*/
    /*saveButton: {
        marginBottom: 5
    },*/
    userModalContent: {
        position: "relative",
        height: "100%"
    },
    exitButton: {
        position: "absolute",
        top: 10,
        right: 0,
        backgroundColor: "transparent",
        fontSize: 20
    },
    answerContainer: {
        width: "100%",
        backgroundColor: "white",
        marginTop: 40,
       
        marginBottom: 10,
        padding: 20,
        borderRadius: 10
    }
});

export default Questions;

