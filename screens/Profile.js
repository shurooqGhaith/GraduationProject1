import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Picker,
  FlatList,
  Modal,
  TouchableHighlight,
  Alert,
  TouchableOpacity
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import fire from "../constants/firebaseConfigrations";
import DateTimePicker from "react-native-modal-datetime-picker";
import MapView, { Marker } from "react-native-maps";
import { Divider, Icon, Header } from 'react-native-elements';
import { Table, TableWrapper, Row, Cell, Col } from 'react-native-table-component';
import { Appbar } from 'react-native-paper';

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.authListener = this.authListener.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      modalVisible: false,
      user: null,
      workingHours: [],
      username: "",
      email: '',
      clinicName: [],
      phone: '',
      phoneExist: false,
      from: "",
      to: "",
      id: "",
      closedAt: "",
      latitude: 0,
      longitude: 0,
      nodata: false,
      Specialization: '',
      patientInfo: [],

      isVerified: false,

      changeWorkingColor: false,
      changeAppColor: false,
      changeLocationColor: false,
      changePatientColor: false,
      changeAgendaColor: false,
      changeCommunityColor:false,
      
      avatar: '',
      avatarExist: false
      //Images.initialProfilePicture
    }
  }

  componentDidMount() {
    this.authListener();
  }


  authListener() {

    const { navigation } = this.props;
    // var id=navigation.getParam('id');
    var name, start, end, close;

    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          this.setState({ isVerified: true });
          //     console.log("verified");
        } else {
          this.setState({ isVerified: false });
          user.sendEmailVerification().then(() => {
            //         console.log("sent");
            if (user.emailVerified) {
              this.setState({ isVerified: true });
              //             console.log("verified");

            }

          }).catch(() => console.log("error"))
        }

      
        const id = user.uid;
        fire.database().ref("users").child(id).on('value', (dataSnapshot) => {

          let clinicName = [], workingHours = [], nodata = true, avatarExist = false, phoneExist = false;

          if (dataSnapshot.val().clinicName) {
            clinicName = Object.values(dataSnapshot.val().clinicName);
          }

          if (dataSnapshot.val().workingHours) {
            workingHours = Object.values(dataSnapshot.val().workingHours);
            nodata = false;
          }

          if (dataSnapshot.val().avatar) {
            avatarExist = true;
          }

          if (dataSnapshot.val().phone) {
            phoneExist = true;
          }

          this.setState({
            user: dataSnapshot,
            id: id,
            Specialization: dataSnapshot.val().Specialization,
            username: dataSnapshot.val().name,
            email: dataSnapshot.val().email,
            clinicName: clinicName,
            workingHours: workingHours,
            nodata: nodata,
            avatar: dataSnapshot.val().avatar,
            avatarExist: avatarExist,
            phone: dataSnapshot.val().phone,
            phoneExist: phoneExist
          });
        });
      } //if user
      else {
        this.props.navigation.navigate("Login");
      }
    })



  }


  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  logout() {
    fire.auth().signOut();
  }

  render() {
    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >

            <Block style={{ marginBottom: theme.SIZES.BASE, marginTop: 70 }}>
              <Header
                backgroundColor='#fff'
                leftComponent={{ icon: 'home', color: '#172B4D' }}
                centerComponent={<Text style={{ color: '#172B4D' }}></Text>}
                rightComponent={<Button small style={{ backgroundColor: '#172B4D' }} small onPress={() => fire.auth().signOut()}><Text style={{ color: '#fff' }}>Logout</Text></Button>}
              />
            </Block>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >



              {/* {!this.state.isVerified && */}
                <Block flex style={styles.profileCard}>
                  <Block middle style={styles.avatarContainer}>
                    {this.state.avatarExist && <View><Image
                      source={{ uri: this.state.avatar }}
                      style={styles.avatar}
                    /></View>}

                    {!this.state.avatarExist && <View><Image
                      source={Images.initialProfilePicture}
                      style={styles.avatar}
                    /></View>}

                    <Block>




                    </Block>
                  </Block>
                  <Block style={styles.info}>
                    <Text bold size={20} color="#32325D" style={{ marginLeft: 36 }}>
                      {this.state.username}
                    </Text>
                    <Block
                      middle
                      row
                      space="evenly"
                      style={{ marginTop: 20, paddingBottom: 24 }}
                    >
                      <Button
                        small
                        style={{ backgroundColor: argonTheme.COLORS.INFO }}
                        onPress={() => this.props.navigation.navigate("UpdateInfo", { id: this.state.id, type: 'doctor' })}
                      >
                        Edit
                                        </Button>
                      <Button
                        onPress={() => this.props.navigation.navigate("Main", { sender: this.state.id, name: this.state.username, email: this.state.email, type: "doctor" })}

                        small
                        style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
                      >

                        MESSAGE
                                        </Button>
                    </Block>
                    <Divider style={{ backgroundColor: '#E9ECEF', marginTop: 10, width: width * 0.8 }} />
                  </Block>

                  <Block flex>
                    <Block middle style={styles.nameInfo}>

                      <View style={{ flexDirection: 'column', marginTop: 5 }}>
                        <Text style={{ color: '#aaa' }}>Email:</Text>
                        <Text size={15} color="#32325D"> {this.state.email}</Text>
                        <Divider style={{ backgroundColor: '#E9ECEF', marginTop: 10, width: width * 0.6 }} />
                        {this.state.phoneExist && <View>
                          <Text style={{ color: '#aaa' }} > Phone Number:</Text>
                          <Text size={15} color="#32325D" > {this.state.phone}</Text>
                        </View>}
                        <Divider style={{ backgroundColor: '#E9ECEF', marginTop: 10, width: width * 0.6 }} />
                        <Text style={{ color: '#aaa' }}>Specialization:</Text>
                        <Text size={15} color="#32325D"> {this.state.Specialization}</Text>
                        <Divider style={{ backgroundColor: '#E9ECEF', marginTop: 10, width: width * 0.6 }} />
                        <Text style={{ color: '#aaa' }}>clinic Name:</Text>
                        <View style={{ flexDirection: 'row' }}>
                          {this.state.clinicName.map((value, ind) => {
                            return (
                              <Text key={ind} style={{ marginLeft: 2 }} color="#32325D">{value.clinic}</Text>
                            )
                          })}
                        </View>
                      </View>



                    </Block>
                    <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                      <Block style={styles.divider} />
                    </Block>
                    <Block >



                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} >
                        <View style={styles.iconButton1}>
                          <Icon type='material-community' name={'clock'} size={52} color={this.state.changeWorkingColor ? '#B71C1C' : '#172B4D'}
                            onPress={() => {
                              this.setState({ changeWorkingColor: !this.state.changeWorkingColor });
                              setTimeout(function () {
                                this.setState({ changeWorkingColor: !this.state.changeWorkingColor });
                                this.props.navigation.navigate("DoctorInfo", { id: this.state.id });
                              }.bind(this), 1000);

                            }}
                          />
                          <Text style={{ paddingHorizontal: 20, paddingVertical: 10 }} color='#aaa'>working hours</Text>
                        </View>

                        <View style={styles.iconButton1}>
                          <Icon name={'people'} size={52} color={this.state.changePatientColor ? '#B71C1C' : '#172B4D'}
                            onPress={() => {
                              this.setState({ changePatientColor: !this.state.changePatientColor })
                              setTimeout(function () {
                                this.setState({ changePatientColor: !this.state.changePatientColor });
                                this.props.navigation.navigate("PatientAfterSession", { id: this.state.id })
                              }.bind(this), 1000);
                            }}//show patient name
                          />
                          <Text style={{ paddingHorizontal: 35,paddingVertical:10 }} color='#aaa'>Patients</Text>
                        </View>

                        <View style={styles.iconButton1}>
                          <Icon type='material-community' name={'account-clock'} size={52} color={this.state.changeAppColor ? '#B71C1C' : '#172B4D'}
                            onPress={() => {
                              this.setState({ changeAppColor: !this.state.changeAppColor });
                              setTimeout(function () {
                                this.setState({ changeAppColor: !this.state.changeAppColor });
                                this.props.navigation.navigate("DoctorAppointment", { id: this.state.id })//show patient name
                              }.bind(this), 1000);
                            }}
                          />
                          <Text style={{ paddingHorizontal: 20,paddingVertical:10 }} color='#aaa'>Sessions Info.</Text>
                        </View>
                        <View style={styles.iconButton1}>
                          <Icon type='material-community' name={'map-marker'} size={52} color={this.state.changeLocationColor ? '#B71C1C' : '#172B4D'}
                            onPress={() => {
                              this.setState({ changeLocationColor: !this.state.changeLocationColor });
                              setTimeout(function () {
                                this.setState({ changeLocationColor: !this.state.changeLocationColor });
                                this.props.navigation.navigate("Pro", { id: this.state.id })
                              }.bind(this), 1000);
                            }}
                          />
                          <Text style={{ paddingHorizontal: 35,paddingVertical:10 }} color='#aaa'>Location</Text>
                        </View>
                        <View style={styles.iconButton1}>
                          <Icon type='material-community' name={'calendar-multiselect'} size={52} color={this.state.changeAgendaColor ? '#B71C1C' : '#172B4D'}
                            onPress={() => {
                              this.setState({ changeAgendaColor: !this.state.changeAgendaColor });
                              setTimeout(function () {
                                this.setState({ changeAgendaColor: !this.state.changeAgendaColor });
                                this.props.navigation.navigate("DoctorAgenda", { id: this.state.id })
                              }.bind(this), 1000);
                            }}
                          />
                          <Text style={{ paddingHorizontal: 35,paddingVertical:10 }} color='#aaa'>Agenda</Text>
                        </View>
                        <View style={styles.iconButton1}>
                          <Icon type='material-community' name={'cloud-question'} size={52} color={this.state.changeCommunityColor ? '#B71C1C' : '#172B4D'}
                            onPress={() => {
                              this.setState({ changeCommunityColor: !this.state.changeCommunityColor });
                              setTimeout(function () {
                                this.setState({ changeCommunityColor: !this.state.changeCommunityColor });
                                this.props.navigation.navigate("answer", { user: this.state.user })
                              }.bind(this), 1000);
                            }}
                          />
                          <Text style={{ paddingHorizontal: 20,paddingVertical:10 }} color='#aaa'>Community</Text>
                        </View>
                      </View>



                    </Block>



                    <Block
                      row
                      style={{ paddingVertical: 14, alignItems: "baseline" }}
                    >

                    </Block>
                    <Block
                      row
                      style={{ paddingBottom: 20, justifyContent: "flex-end" }}
                    >

                    </Block>
                    <Block>




                    </Block>
                  </Block>
                </Block>
                {/* } */}
            </ScrollView>
          </ImageBackground>
        </Block>

      </Block>
    );
  }
}

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    backgroundColor: '#333',
    width: width,
    height: 30,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },

  iconButton: {
    flexDirection: 'column',
    // justifyContent:'space-between',
    marginTop: 5,
    height: 130,
    padding: 25,
    borderColor: '#172B4D',
    borderWidth: 1,
    // paddingRight:18,
    borderRadius: 30,
    width: 130,
    //alignItems:'center',
    backgroundColor: "#fff",
  },

  iconButton1: {
    flexDirection: 'column',
    marginLeft: 10,
    marginTop: 5,
    // justifyContent:'space-between',
    height: height * 0.171,
    paddingTop: 25,
    borderColor: '#172B4D',
    borderWidth: 1,
    // paddingRight:18,
    borderRadius: 20,
    width: width * 0.361,
    //alignItems:'center',
    backgroundColor: "#fff",
  },


  headerText: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold"
  },
  menuContent: {
    color: "#000",
    fontWeight: "bold",
    padding: 2,
    fontSize: 20
  },
  text: {
    margin: 6
  },

  itemsList: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  itemtext: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    marginTop: 10
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  }
});

export default Profile;